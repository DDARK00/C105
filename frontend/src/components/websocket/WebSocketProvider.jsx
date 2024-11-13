import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { debounce } from "lodash";
import PropTypes from "prop-types";

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
        // 연결 유지 설정 추가
        maxBackoffTime: 10000,        // 최대 재연결 대기 시간
        reconnectInterval: 3000,      // 재연결 시도 간격
        disableBc: true,             // 브로드캐스트 채널 비활성화
        keepAliveInterval: 30000,     // keepAlive 간격
      }
    );

    console.log("===== WebSocket 연결 시도 =====");
    console.log("연결 URL:", `ws://localhost:8080/ws/${documentType}/${ideaId}`);

    wsProvider.current = wsProvider;

    // 연결 상태 모니터링
    wsProvider.on("status", ({ status }) => {
      console.log("WebSocket 상태 변경:", status);
      setConnectionStatus(status);
    });

    // 에러 핸들링 추가
    wsProvider.on("connection-error", (error) => {
      console.error("WebSocket 연결 에러:", error);
    });

    // 텍스트 변경 관찰
    ytext.current.observe((event) => {
      if (event.transaction.local) return; // 로컬 변경사항은 무시

      const content = ytext.current.toString();
      debouncedCallback(content);
    });

    return () => {
      debouncedCallback.cancel();
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

  const sendMessage = debounce((content) => {
    try {
      if (wsProvider.current && wsProvider.current.connected) {
        const message = {
          ideaId: ideaId,
          content: content,
          timestamp: Date.now()
        };
        
        console.log("===== WebSocket 메시지 전송 시도 =====");
        console.log("전송할 메시지:", message);
        
        // ytext를 통해 실시간 업데이트
        ytext.current.delete(0, ytext.current.length);
        ytext.current.insert(0, content);
        
        // 웹소켓으로 메시지 전송
        wsProvider.current.send(JSON.stringify(message));
        console.log("메시지 전송 완료");
        
        // 디바운스된 콜백 실행
        debouncedCallback(content);
      } else {
        console.error("WebSocket이 연결되어 있지 않음!");
        console.log("wsProvider 상태:", wsProvider.current);
      }
    } catch (error) {
      console.error("WebSocket 메시지 전송 중 에러:", error);
    }
  }, 100); // 100ms 디바운스로 빠른 실시간 업데이트 유지

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
