import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./ProposalPage.module.css";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import authAxiosInstance from "../../api//http-commons/authAxios";
import { debounce } from "lodash";

function ProposalPage() {
  const { ideaId } = useParams();
  const stompClient = useRef(null); // WebSocket 클라이언트
  const isLocalUpdate = useRef(false); // 로컬 업데이트 여부 플래그
  const clientId = useRef(`client-${Math.random().toString(36).substr(2, 9)}`); // 고유 클라이언트 ID

  // debounce된 업데이트 함수 생성
  const debouncedSendContent = useRef(
    debounce((content) => {
      // 500ms 동안 추가 업데이트가 없을 때만 실행
      // 불필요한 서버 요청 방지
      if (!stompClient.current?.connected || isLocalUpdate.current) return;

      const operation = {
        ideaId: Number(ideaId),
        data: JSON.stringify({
          content,
          timestamp: Date.now(),
          clientId: clientId.current,
        }),
      };

      // WebSocket으로 변경사항 전송
      stompClient.current.publish({
        destination: `/app/planner/${ideaId}`,
        body: JSON.stringify(operation),
      });
    }, 500)
  ).current;

  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit.configure({
        history: true,
      }),
    ],
    // 내용이 변경될 때마다 디바운스된 함수 호출
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      debouncedSendContent(content);
    },
  });

  useEffect(() => {
    // STOMP 클라이언트 인스턴스 생성
    const client = new Client({
      // WebSocket 서버 연결 설정 (wss는 보안 WebSocket 프로토콜)
      webSocketFactory: () => new WebSocket("wss://oracle1.mypjt.xyz/ws"),
      // CORS 헤더 설정 (크로스 도메인 요청 허용)
      connectHeaders: {
        "Access-Control-Allow-Origin": "*",
      },
      // STOMP 프로토콜 디버깅을 위한 로그 출력
      debug: function (str) {
        console.log("STOMP:", str);
      },
      // 연결이 끊어졌을 때 5초 후 재연결 시도
      reconnectDelay: 5000,
      // 서버와의 연결 상태를 확인하기 위한 heartbeat 설정
      heartbeatIncoming: 4000,  // 서버로부터의 응답 대기 시간
      heartbeatOutgoing: 4000,  // 서버로 보내는 신호 간격

      // WebSocket 연결이 성공했을 때 실행되는 콜백
      onConnect: () => {
        console.log("Connected to WebSocket");
        
        // 특정 주제(topic)를 구독하여 실시간 업데이트 수신
        // ideaId별로 구분된 채널을 구독
        client.subscribe(`/topic/planner/${ideaId}`, (message) => {
          try {
            // 수신된 메시지 디버깅을 위한 로그
            console.log("1. Raw message received:", message);
            console.log("2. Message body:", message.body);

            // 수신된 JSON 문자열을 객체로 파싱
            const data = JSON.parse(message.body);
            console.log("3. Parsed data:", data);

            // 자신이 보낸 메시지는 처리하지 않음 (이중 업데이트 방지)
            if (data.data.clientId === clientId.current) return;

            // 다른 클라이언트의 변경사항을 에디터에 적용
            if (editor && data.data?.content) {
              // 로컬 업데이트 플래그를 설정하여 불필요한 서버 전송 방지
              isLocalUpdate.current = true;
              
              // 현재 커서 위치 저장
              const { from, to } = editor.state.selection;
              
              // 에디터 내용을 새로운 내용으로 업데이트
              editor.commands.setContent(data.data.content);
              
              // 저장해둔 커서 위치 복원
              editor.commands.setTextSelection({ from, to });
              
              // 로컬 업데이트 플래그 해제
              isLocalUpdate.current = false;
            }
          } catch (error) {
            // 메시지 처리 중 발생한 에러의 상세 정보 로깅
            console.error("Parsing error details:", {
              error: error.message,    // 에러 메시지
              step: error.stack,       // 에러 발생 위치의 스택 트레이스
              rawMessage: message.body, // 원본 메시지 내용
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
    });

    client.activate();
    stompClient.current = client;
    loadInitialContent();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [ideaId]);

  // HTTP 요청으로 초기 문서 내용 가져오기(API 호출)
  const loadInitialContent = async () => {
    try {
      console.log("Loading content for ideaId:", ideaId);
      const response = await authAxiosInstance.get(`/api/v1/planner/${ideaId}`);
      console.log("Loaded content:", response.data);

      if (editor && response.data.data?.content) {
        isLocalUpdate.current = true;
        editor.commands.setContent(response.data.data.content);
        isLocalUpdate.current = false;
      }
    } catch (error) {
      console.error("Failed to load content:", error.response?.data || error);
    }
  };

  return (
    <>
      <Helmet>
        <title>기획서</title>
      </Helmet>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 p-4">
          <EditorContent
            className="w-full h-full border rounded-lg p-4 prose max-w-none"
            editor={editor}
          />
        </div>
      </div>
    </>
  );
}

export default ProposalPage;
