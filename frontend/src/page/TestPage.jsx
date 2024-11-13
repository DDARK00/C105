import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

function TestPage() {
  const [input, setInput] = useState(""); // 사용자 입력 메시지
  const [sharedText, setSharedText] = useState(""); // 공유된 메시지

  useEffect(() => {
    // Yjs 문서 및 y-websocket 설정
    const ydoc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      "wss://goodidea.world:1234",
      "test-room",
      ydoc
    );
    const yText = ydoc.getText("sharedText");

    // Yjs 문서 업데이트 시 sharedText 상태에 반영
    yText.observe(() => {
      setSharedText(yText.toString());
    });

    // 연결 상태 로깅
    wsProvider.on("status", ({ status }) => {
      console.log(`WebSocket status: ${status}`);
    });

    // 컴포넌트 언마운트 시 WebSocket 연결 닫기
    return () => {
      wsProvider.disconnect();
      ydoc.destroy();
    };
  }, []);

  const handleSendMessage = () => {
    // 입력값을 Yjs 문서에 반영
    const ydoc = new Y.Doc();
    const yText = ydoc.getText("sharedText");
    yText.delete(0, yText.length); // 기존 내용 삭제
    yText.insert(0, input); // 새로운 내용 삽입
    setInput(""); // 입력창 초기화
  };

  return (
    <div>
      <h1>Y-WebSocket 테스트 페이지</h1>
      <p>실시간 공유된 텍스트: {sharedText}</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="공유할 메시지 입력"
      />
      <button onClick={handleSendMessage}>메시지 전송</button>
    </div>
  );
}

export default TestPage;
