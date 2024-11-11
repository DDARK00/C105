import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { WebSocketProvider } from "../../components/websocket/WebSocketProvider";
import {
  DOCUMENT_TYPES,
  API_ENDPOINTS,
} from "../../components/websocket/constants";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { useWebSocket } from "../../components/websocket/WebSocketProvider";
import authAxiosInstance from "../../api/http-commons/authAxios";
import "./ProposalPage.module.css";

function ProposalEditor() {
  const { sendMessage } = useWebSocket();
  const isLocalUpdate = useRef(false);
  const { ideaId } = useParams();

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit.configure({ history: true })],
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
        console.log("Loading content for ideaId:", ideaId);
        const response = await authAxiosInstance.get(
          `/api/v1/planner/${ideaId}`
        );
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

    loadInitialContent();
  }, [ideaId, editor]);

  const handleMessageReceived = (data) => {
    if (editor && data.data?.content) {
      isLocalUpdate.current = true;
      const { from, to } = editor.state.selection;
      editor.commands.setContent(data.data.content);
      editor.commands.setTextSelection({ from, to });
      isLocalUpdate.current = false;
    }
  };

  return (
    <EditorContent
      className="w-full h-full border rounded-lg p-4 prose max-w-none"
      editor={editor}
    />
  );
}

function ProposalPage() {
  const { projectId, ideaId } = useParams();

  return (
    <WebSocketProvider
      projectId={projectId}
      ideaId={ideaId}
      documentType={DOCUMENT_TYPES.PROPOSAL}
      apiEndpoint={API_ENDPOINTS[DOCUMENT_TYPES.PROPOSAL](ideaId)}
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
