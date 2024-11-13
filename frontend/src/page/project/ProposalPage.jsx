import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  LiveblocksProvider,
  useRoom,
  useMyPresence,
  useOthers,
} from "@liveblocks/react"; // Liveblocks 관련 import
import authAxiosInstance from "../../api/http-commons/authAxios";
import getLiveblocksToken from "../../api/getLiveblocksToken"; // Liveblocks 토큰 발급 함수 import
import styles from "./ProposalPage.module.css"; // styles import 추가
import PropTypes from "prop-types";

// ProposalEditor 컴포넌트
function ProposalEditor({ initialContent }) {
  const [myPresence, updateMyPresence] = useMyPresence(); // 현재 사용자 커서 상태 업데이트
  const others = useOthers(); // 다른 사용자들의 presence 상태
  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit.configure({ history: true })],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class: `${styles.tiptap} prose max-w-none w-full focus:outline-none`,
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML(); // 에디터의 HTML 내용을 가져옴
      updateMyPresence({ content }); // 내 상태로 업데이트
    },
  });

  // 마우스 이동 시 커서 위치 업데이트 핸들러
  const handleMouseMove = (event) => {
    updateMyPresence({
      cursor: { x: event.clientX, y: event.clientY }, // 현재 커서 위치 전송
    });
  };

  useEffect(() => {
    if (editor && initialContent !== null) {
      editor.commands.setContent(initialContent);
    }
    // 마우스 이동 이벤트 리스너 등록
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [editor, initialContent]);

  return (
    <div className="relative">
      <EditorContent
        className="w-full h-full border rounded-lg p-4"
        editor={editor}
      />
      {/* 다른 사용자들의 커서 표시 */}
      {others.map(({ connectionId, presence }) => {
        if (presence?.cursor) {
          return (
            <div
              key={connectionId}
              className="absolute pointer-events-none"
              style={{
                left: presence.cursor.x,
                top: presence.cursor.y,
                backgroundColor: "blue",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

ProposalEditor.propTypes = {
  initialContent: PropTypes.string,
};

ProposalEditor.defaultProps = {
  initialContent: "",
};

// ProposalPage 컴포넌트
function ProposalPage() {
  const { projectId, ideaId } = useParams(); // URL 파라미터에서 프로젝트 및 아이디어 ID를 가져옴
  const [plannerData, setPlannerData] = useState(""); // 플래너 데이터 상태
  const [liveblocksToken, setLiveblocksToken] = useState(null); // Liveblocks 토큰 상태

  useEffect(() => {
    const fetchPlannerData = async () => {
      try {
        const response = await authAxiosInstance.get(
          `api/v1/planner/${ideaId}`
        );
        setPlannerData(response.data.data.content || "");
      } catch (error) {
        console.error("기획서 데이터 로딩 실패:", error);
        setPlannerData("");
      }
    };

    const fetchLiveblocksToken = async () => {
      try {
        const token = await getLiveblocksToken(ideaId, "planner");
        setLiveblocksToken(token);
      } catch (error) {
        console.error("Liveblocks 토큰 발급 실패:", error);
      }
    };

    fetchPlannerData();
    fetchLiveblocksToken();
  }, [ideaId]);

  if (!liveblocksToken) {
    return <div>Loading...</div>; // 토큰을 기다리는 동안 로딩 표시
  }

  return (
    <LiveblocksProvider client={{ authEndpoint: () => liveblocksToken }}>
      <Helmet>
        <title>기획서</title>
      </Helmet>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 p-4">
          <ProposalEditor initialContent={plannerData} />
        </div>
      </div>
    </LiveblocksProvider>
  );
}

export default ProposalPage;
