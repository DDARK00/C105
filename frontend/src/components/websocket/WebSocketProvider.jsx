import { createContext, useContext, useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { DOCUMENT_TYPES } from "./constants";

const WebSocketContext = createContext(null);

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({
  children,
  projectId, // 프로젝트 ID 추가
  ideaId,
  documentType,
  onMessageReceived,
}) {
  const stompClient = useRef(null);
  const clientId = useRef(`client-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => {
        const socket = new WebSocket("wss://oracle1.mypjt.xyz/ws");
        socket.onerror = (error) => {
          console.error("WebSocket native error:", error);
        };
        return socket;
      },

      connectHeaders: {
        Origin: window.location.origin,
      },

      reconnectDelay: 5000,
      maxRetries: 5,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log(`Connected to WebSocket for ${documentType}`);

        // projectId와 ideaId를 포함한 토픽 구독
        client.subscribe(
          `/topic/project/${projectId}/idea/${ideaId}/${documentType}`,
          (message) => {
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
          }
        );
      },
      onError: (error) => {
        console.error("WebSocket Error:", error);
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
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
      destination: `/app/project/${projectId}/idea/${ideaId}/${documentType}`,
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
