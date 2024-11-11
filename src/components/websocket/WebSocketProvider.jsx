import { createContext, useContext, useRef, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { debounce } from "lodash";
import authAxiosInstance from "../../api/http-commons/authAxios";

const WebSocketContext = createContext(null);

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ 
  children, 
  projectId,
  ideaId, 
  documentType,
  apiEndpoint,
  onMessageReceived
}) {
  const stompClient = useRef(null);
  const clientId = useRef(`client-${Math.random().toString(36).substr(2, 9)}`);
  const isLocalUpdate = useRef(false);

  // 자동 저장을 위한 debounce 함수
  const debouncedSaveContent = useRef(
    debounce(async (content) => {
      try {
        await authAxiosInstance.put(apiEndpoint, {
          projectId: Number(projectId),
          ideaId: Number(ideaId),
          content: content
        });
        console.log("Content saved successfully");
      } catch (error) {
        console.error("Failed to save content:", error);
      }
    }, 1000)
  ).current;

  // 실시간 협업을 위한 debounce 함수
  const debouncedSendContent = useRef(
    debounce((content) => {
      if (!stompClient.current?.connected || isLocalUpdate.current) return;

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
    }, 500)
  ).current;

  // WebSocket 설정 및 연결 로직
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new WebSocket("wss://oracle1.mypjt.xyz/ws"),
      connectHeaders: { 'Origin': window.location.origin },
      reconnectDelay: 5000,
      maxRetries: 5,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log(`Connected to WebSocket for ${documentType}`);
        
        // 각 문서 타입별 토픽 구독
        client.subscribe(`/topic/${documentType}/${ideaId}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            if (data.data.clientId === clientId.current) return;
            onMessageReceived(data);
          } catch (error) {
            console.error("Parsing error details:", error);
          }
        });
      },
      
      onError: (error) => console.error("WebSocket Error:", error),
      onDisconnect: () => console.log("Disconnected from WebSocket"),
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
    <WebSocketContext.Provider value={{ 
      debouncedSaveContent,
      debouncedSendContent,
      isLocalUpdate,
      clientId: clientId.current
    }}>
      {children}
    </WebSocketContext.Provider>
  );
}
