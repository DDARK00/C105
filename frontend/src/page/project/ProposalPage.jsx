"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useStorage } from "@liveblocks/react";
import { Helmet } from "react-helmet-async";
import { updateProposal, getProposal } from "../../api/axios";

export function ProposalEditor() {
  const { ideaId } = useParams(); // URL에서 ideaId 파라미터 가져오기
  const [initialContent, setInitialContent] = useState(""); // 초기 콘텐츠 상태

  // Liveblocks Extension을 Tiptap에 적용하여 실시간 협업 기능 활성화
  const liveblocks = useLiveblocksExtension({
    publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
  });

  // Liveblocks Storage를 활용해 상태를 실시간으로 동기화
  const { root, setRoot } = useStorage();

  // Tiptap 에디터 초기화 설정
  const editor = useEditor({
    extensions: [StarterKit, liveblocks], // 기본 툴셋과 Liveblocks 실시간 기능 추가
    editorProps: {
      attributes: {
        class: "editor w-full h-full border rounded-lg p-4", // 에디터 스타일 클래스
      },
    },
    onUpdate: ({ editor }) => {
      // 에디터 업데이트 시, 현재 콘텐츠를 실시간 저장소에 동기화
      const content = editor.getHTML();
      if (root && root.content !== content) {
        setRoot((prev) => ({ ...prev, content })); // 콘텐츠 변경 시 root 업데이트
      }
    },
  });

  // 서버에서 초기 기획서 데이터를 가져와 에디터에 설정
  useEffect(() => {
    const fetchInitialContent = async () => {
      try {
        const response = await getProposal(ideaId);
        setInitialContent(response.data.data.content || ""); // 서버에서 초기 데이터를 설정
        if (editor) {
          editor.commands.setContent(response.data.data.content || ""); // 에디터에 초기 내용 설정
        }
      } catch (error) {
        console.error("Failed to fetch planner content:", error); // 오류 시 메시지 출력
      }
    };
    fetchInitialContent(); // 초기 콘텐츠 불러오기
  }, [ideaId, editor]); // 초기 로드 시 실행 (InitialContent는 불필요)

  // 방을 나갈 때 최종 변경사항을 DB에 저장하는 함수
  const saveContentToDB = async (content) => {
    try {
      const response = await updateProposal(ideaId, content);
      if (response.status === 200) {
        console.log("Document saved to the database."); // 성공적으로 저장되었을 때 로그 출력
      } else {
        console.error("Failed to save content to DB:", response.status); // 오류 시 로그 출력
      }
    } catch (error) {
      console.error("Failed to save content to DB:", error); // 오류 시 로그 출력
    }
  };

  // 방을 나가거나 새로고침 시 최종 변경사항을 서버에 저장
  useEffect(() => {
    const handleUnload = () => {
      if (editor) {
        const finalContent = editor.getHTML(); // 에디터에서 최종 콘텐츠 가져오기
        saveContentToDB(finalContent); // 서버에 최종 콘텐츠 저장
      }
    };

    // 페이지 언마운트 시나 브라우저 종료 시 이벤트 리스너 추가
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload); // 컴포넌트 언마운트 시 리스너 제거
  }, [editor]); // editor가 변경될 때마다 실행

  if (!editor) {
    return <div>Loading...</div>; // 에디터 로딩 중인 상태 표시
  }

  return (
    <div className="h-full w-full flex flex-col">
      <Helmet>
        <title>기획서</title> {/* 페이지 제목 설정 */}
      </Helmet>
      <EditorContent editor={editor} className="editor" /> {/* 에디터 내용 */}
    </div>
  );
}

export default ProposalEditor;
