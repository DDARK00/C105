import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { WebSocketProvider } from "../../components/websocket/WebSocketProvider";
import { DOCUMENT_TYPES, API_ENDPOINTS } from "../../components/websocket/constants";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useWebSocket } from "../../components/websocket/WebSocketProvider";
import styles from "./ProposalPage.module.css";

function ProposalPage() {
  const { projectId, ideaId } = useParams();
  
  // Tiptap 에디터 설정
  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit.configure({ history: true })],
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      // WebSocketProvider의 debounce 함수들 사용
      debouncedSendContent(content);
      debouncedSaveContent(content);
    },
  });

  return (
    <WebSocketProvider 
      projectId={projectId}
      ideaId={ideaId}
      documentType={DOCUMENT_TYPES.PLANNER}
      apiEndpoint={API_ENDPOINTS[DOCUMENT_TYPES.PLANNER](ideaId)}
    >
      <Helmet>
        <title>기획서</title>
      </Helmet>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 p-4">
          <EditorContent
            editor={editor}
            className={styles.tiptap}
          />
        </div>
      </div>
    </WebSocketProvider>
  );
}

export default ProposalPage;