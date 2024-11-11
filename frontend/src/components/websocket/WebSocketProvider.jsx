import { createContext, useContext, useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import PropTypes from 'prop-types';
import { DOCUMENT_TYPES } from "./constants";

const WebSocketContext = createContext(null);

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({
  children,
  projectId,
  ideaId,
  documentType,
  onMessageReceived,
}) {
  const stompClient = useRef(null);
  const clientId = useRef(`client-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const client = new Client({
        webSocketFactory: () => {
          const wsUrl = window.location.hostname === 'localhost'
            ? 'ws://localhost:8080/ws'
            : `wss://${window.location.hostname}/ws`;
            
          const socket = new WebSocket(wsUrl);
          socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
            if (error.target) {
                console.error("ReadyState:", error.target.readyState);
                console.error("URL:", error.target.url);
            }
          };
          return socket;
        },

      connectHeaders: {
        Origin: window.location.origin,
      },

      reconnectDelay: 5000,
      maxRetries: 5,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log(`Connected to WebSocket for ${documentType}`);

        client.subscribe(`/topic/${documentType}/${ideaId}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            if (data.data.clientId === clientId.current) return;
            onMessageReceived(data);
          } catch (error) {
            console.error("Parsing error details:", {
              error: error.message,
              step: error.stack,
              rawMessage: message.body,
            });
          }
        });
      },
      onError: (error) => {
        console.error("WebSocket Error:", error);
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
      debug: (str) => {
        console.log("STOMP Debug:", str);
      }
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [projectId, ideaId, documentType, onMessageReceived]);

  const sendMessage = (content) => {
    if (!stompClient.current?.connected) return;

    const operation = {
      projectId: Number(projectId),
      ideaId: Number(ideaId),
      data: JSON.stringify({
        content,
        timestamp: Date.now(),
        clientId: clientId.current,
        documentType,
      }),
    };

    stompClient.current.publish({
      destination: `/app/${documentType}/${ideaId}`,
      body: JSON.stringify(operation),
    });
  };

  return (
    <WebSocketContext.Provider
      value={{ sendMessage, clientId: clientId.current }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  ideaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  documentType: PropTypes.oneOf(Object.values(DOCUMENT_TYPES)).isRequired,
  onMessageReceived: PropTypes.func.isRequired,
};