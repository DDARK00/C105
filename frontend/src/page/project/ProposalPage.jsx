"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useLiveblocksExtension, useStorage } from "@liveblocks/react-tiptap";
import { Helmet } from "react-helmet-async";
import { Toolbar } from "./Toolbar"; // 툴바 컴포넌트
import { Threads } from "./Threads"; // 쓰레드 컴포넌트

export function ProposalEditor() {
  const { ideaId } = useParams();

  // Liveblocks Extension을 Tiptap에 적용 (퍼블릭 키로 설정)
  const liveblocks = useLiveblocksExtension({
    publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
  });

  // Liveblocks Storage 사용 (문서 데이터를 동기화하고 저장)
  const { root, setRoot } = useStorage();

  const editor = useEditor({
    extensions: [StarterKit, liveblocks],
    editorProps: {
      attributes: {
        class: "editor w-full h-full border rounded-lg p-4",
      },
    },
    onUpdate: ({ editor }) => {
      // 에디터 내용이 변경될 때마다 Storage에 업데이트
      const content = editor.getHTML();
      if (root && root.content !== content) {
        setRoot((prev) => ({ ...prev, content })); // Storage의 content 업데이트
      }
    },
  });

  // 페이지 로드 시 Storage의 초기 데이터로 에디터 설정
  useEffect(() => {
    if (root && root.content && editor) {
      editor.commands.setContent(root.content);
    }
  }, [root, editor]);

  if (!editor) {
    return <div>Loading...</div>; // 에디터 로딩 중
  }

  return (
    <div className="h-full w-full flex flex-col">
      <Helmet>
        <title>기획서</title>
      </Helmet>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="editor" />
      <Threads editor={editor} />
    </div>
  );
}

export default ProposalEditor;
