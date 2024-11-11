import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  WebSocketProvider,
  useWebSocket,
} from "../../components/websocket/WebSocketProvider";
import {} from "../../components/websocket/constants";
import authAxiosInstance from "../../api/http-commons/authAxios";
import styles from "./ProposalPage.module.css"; // styles import 추가
import PropTypes from "prop-types";

function ProposalEditor({ initialContent }) {
  const { sendMessage } = useWebSocket();
  const isLocalUpdate = useRef(false);

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit.configure({ history: true })],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: `${styles.tiptap} prose max-w-none w-full focus:outline-none`,
      },
    },
    onUpdate: ({ editor }) => {
      if (!isLocalUpdate.current) {
        const content = editor.getHTML();
        sendMessage(content);
      }
    },
  });

  useEffect(() => {
    if (editor && initialContent !== null) {
      isLocalUpdate.current = true;
      editor.commands.setContent(initialContent);
      isLocalUpdate.current = false;
    }
  }, [editor, initialContent]);

  return (
    <EditorContent
      className="w-full h-full border rounded-lg p-4"
      editor={editor}
    />
  );
}

ProposalEditor.propTypes = {
  initialContent: PropTypes.string,
};

ProposalEditor.defaultProps = {
  initialContent: "",
};

function ProposalPage() {
  const { projectId, ideaId } = useParams();
  const [plannerData, setPlannerData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authAxiosInstance.get(
          `api/v1/planner/${ideaId}`
        );
        console.log("Loaded planner data:", response.data);
        setPlannerData(response.data.data.content || '');
      } catch (error) {
        console.error("기획서 데이터 로딩 실패:", error);
        setPlannerData('');
      }
    };

    fetchData();
  }, [ideaId]);

  const handleMessageReceived = (data) => {
    console.log("Received message:", data);
    if (data && data.content) {
      setPlannerData(data.content);
    }
  };

  return (
    <WebSocketProvider
      projectId={projectId}
      ideaId={ideaId}
      documentType="planner"
      onMessageReceived={handleMessageReceived}
    >
      <Helmet>
        <title>기획서</title>
      </Helmet>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 p-4">
          <ProposalEditor initialContent={plannerData} />
        </div>
      </div>
    </WebSocketProvider>
  );
}

export default ProposalPage;
