import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import authAxiosInstance from "../../api/http-commons/authAxios";

const WebSocketContext = createContext(null);

export function WebSocketProvider({
  children,
  ideaId,
  documentType,
  onMessageReceived,
}) {
  const ydoc = useRef(null);
  const wsProvider = useRef(null);
  const ytext = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const debouncedCallback = useRef(
    debounce((content) => {
      onMessageReceived({
        content,
        timestamp: Date.now(),
        documentType,
        ideaId,
      });
    }, 500)
  ).current;

  // 자동 저장을 위한 디바운스 함수
  const debouncedSave = useRef(
    debounce(async (content) => {
      try {
        await authAxiosInstance.put(`api/v1/planner/${ideaId}`, {
          content: content,
        });
        console.log("Content saved successfully");
      } catch (error) {
        console.error("Failed to save content:", error);
      }
    }, 1000) // 1초 딜레이
  ).current;

  useEffect(() => {
    // YJS 문서 초기화
    ydoc.current = new Y.Doc();
    ytext.current = ydoc.current.getText("content");

    // WebSocket 연결 설정
    const wsProvider = new WebsocketProvider(
      "ws://localhost:8080/ws",
      `${documentType}/${ideaId}`,
      ydoc.current,
      {
        connect: true,
        WebSocketPolyfill: WebSocket,
        // 연결 재시도 설정 추가
        maxBackoffTime: 3000,
        reconnectInterval: 1000,
      }
    );

    wsProvider.current = wsProvider;

    // 연결 상태 모니터링
    wsProvider.on("status", ({ status }) => {
      console.log("WebSocket status:", status);
      setConnectionStatus(status);
    });

    // 에러 핸들링 추가
    wsProvider.on("connection-error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    // 텍스트 변경 관찰
    ytext.current.observe((event) => {
      if (event.transaction.local) return; // 로컬 변경사항은 무시

      const content = ytext.current.toString();
      debouncedCallback(content);
    });

    return () => {
      debouncedCallback.cancel();
      debouncedSave.cancel();
      if (wsProvider) {
        wsProvider.disconnect();
        setTimeout(() => {
          wsProvider.destroy();
        }, 1000);
      }
      if (ydoc.current) {
        ydoc.current.destroy();
      }
    };
  }, [ideaId, documentType, onMessageReceived, debouncedCallback]);

  const sendMessage = (content) => {
    if (!ytext.current) return;

    // YJS 문서 업데이트
    ydoc.current.transact(() => {
      ytext.current.delete(0, ytext.current.length);
      ytext.current.insert(0, content);
    });

    // 변경사항 자동 저장
    debouncedSave(content);
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, connectionStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
}

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  ideaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  documentType: PropTypes.string.isRequired,
  onMessageReceived: PropTypes.func.isRequired,
};

export function useWebSocket() {
  return useContext(WebSocketContext);
}
