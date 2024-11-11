import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  WebSocketProvider,
  useWebSocket,
} from "../../components/websocket/WebSocketProvider";
import {
  DOCUMENT_TYPES,
  API_ENDPOINTS,
} from "../../components/websocket/constants";
import authAxiosInstance from "../../api/http-commons/authAxios";
import styles from "./ProposalPage.module.css"; // styles import 추가

function ProposalEditor() {
  const { sendMessage } = useWebSocket();
  const isLocalUpdate = useRef(false);
  const { ideaId } = useParams();

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit.configure({ history: true })],
    editorProps: {
      attributes: {
        class: `${styles.tiptap} prose max-w-none w-full focus:outline-none`, // styles 적용
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      if (!isLocalUpdate.current) {
        sendMessage(content);
      }
    },
  });

  // 초기 콘텐츠 로딩
  useEffect(() => {
    const loadInitialContent = async () => {
      try {
        const response = await authAxiosInstance.get(
          API_ENDPOINTS[DOCUMENT_TYPES.PROPOSAL](ideaId)
        );

        if (editor && response.data.data?.content) {
          isLocalUpdate.current = true;
          editor.commands.setContent(response.data.data.content);
          isLocalUpdate.current = false;
        }
      } catch (error) {
        console.error("Failed to load content:", error);
      }
    };

    loadInitialContent();
  }, [ideaId, editor]);

  return (
    <EditorContent
      className="w-full h-full border rounded-lg p-4"
      editor={editor}
    />
  );
}

function ProposalPage() {
  const { projectId, ideaId } = useParams();

  const handleMessageReceived = (data) => {
    try {
      const parsedData = JSON.parse(data.data);
      if (parsedData.content) {
        const editor = document.querySelector(`.${styles.tiptap}`)?.editor; // styles 사용
        if (editor) {
          const isLocalUpdate = editor.view.state.doc.content.size === 0;
          if (!isLocalUpdate) {
            editor.commands.setContent(parsedData.content);
          }
        }
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  };

  return (
    <WebSocketProvider
      projectId={projectId}
      ideaId={ideaId}
      documentType={DOCUMENT_TYPES.PROPOSAL}
      onMessageReceived={handleMessageReceived}
    >
      <Helmet>
        <title>기획서</title>
      </Helmet>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 p-4">
          <ProposalEditor />
        </div>
      </div>
    </WebSocketProvider>
  );
}

export default ProposalPage;
