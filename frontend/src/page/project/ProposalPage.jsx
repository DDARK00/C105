import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./ProposalPage.module.css";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import authAxiosInstance from "../../api//http-commons/authAxios";
import { debounce } from "lodash";
import useIdeaStore from "../../store/useIdeaStore";

function ProposalPage() {
  const { ideaId: routeIdeaId } = useParams();
  const { setIdeaId, ideaId, clearIdeaId } = useIdeaStore();

  const stompClient = useRef(null); // WebSocket 클라이언트
  const isLocalUpdate = useRef(false); // 로컬 업데이트 여부 플래그
  const clientId = useRef(`client-${Math.random().toString(36).substr(2, 9)}`); // 고유 클라이언트 ID

  // URL의 ideaId를 store에 저장
  useEffect(() => {
    if (routeIdeaId) {
      setIdeaId(Number(routeIdeaId));
    }
    return () => {
      clearIdeaId();
    };
  }, [routeIdeaId, setIdeaId, clearIdeaId]);

  // debounce된 업데이트 함수 생성
  const debouncedSendContent = useRef(
    debounce((content) => {
      // 500ms 동안 추가 업데이트가 없을 때만 실행
      // 불필요한 서버 요청 방지
      if (!stompClient.current?.connected || isLocalUpdate.current) return;

      const operation = {
        ideaId: ideaId,
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
    const client = new Client({
      brokerURL: `https://oracle1.mypjt.xyz/ws`,
      connectHeaders: {},
      debug: function (str) {
        console.log("STOMP:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("Connected to WebSocket");
        // 다른 클라이언트의 변경사항 수신
        client.subscribe(`/topic/planner/${ideaId}`, (message) => {
          try {
            // ... 메시지 파싱 및 처리
            console.log("1. Raw message received:", message);
            console.log("2. Message body:", message.body);

            const data = JSON.parse(message.body);
            console.log("3. Parsed data:", data);

            // 자신이 보낸 메시지는 무시
            if (data.data.clientId === clientId.current) return;

            // data.data.content로 수정
            if (editor && data.data?.content) {
              isLocalUpdate.current = true;
              const { from, to } = editor.state.selection;
              editor.commands.setContent(data.data.content);
              editor.commands.setTextSelection({ from, to });
              isLocalUpdate.current = false;
            }
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
