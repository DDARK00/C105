import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import "./ProposalPage.module.css";

import * as Y from "yjs";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import { useEffect, useRef, useState } from "react";
import { HocuspocusProvider, TiptapCollabProvider } from "@hocuspocus/provider";

const ydoc = new Y.Doc();
function ProposalPage() {
  // useRef를 사용하여 provider를 저장할 공간을 만듭니다.
  const providerRef = useRef(null);
  // useEditor를 최상위에서 호출하여 editor 인스턴스를 생성합니다.
  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit.configure({
        history: false,
      }),

      Collaboration.configure({
        document: ydoc,
      }),
    ],
  });

  useEffect(() => {
    // HocuspocusProvider 생성 및 연결
    providerRef.current = new HocuspocusProvider({
      url: "ws://192.168.100.129:3001", // WebSocket URL
      name: "document-name2", // 동기화할 문서 식별자
      document: ydoc, // Y.js 문서 객체 생성
      token: "notoken", // JWT 토큰 (필요에 따라 설정)

      onSynced: () => {
        console.log("Synced with server");
      },
    });

    // provider가 초기화되면 상태를 업데이트
    providerRef.current.on("sync", () => {
      // setIsProviderReady(true);
    });

    // 컴포넌트 언마운트 시 provider 해제
    return () => {
      providerRef.current?.destroy();
    };
  }, [editor]);

  // useEffect(() => {
  //   if (editor && isProviderReady && providerRef.current) {
  //     // provider의 문서 객체를 editor에 설정합니다.
  //     editor.setOptions({
  //       extensions: [
  //         StarterKit,
  //         Collaboration.configure({
  //           document: providerRef.current.document, // provider의 문서를 사용
  //         }),
  //       ],
  //     });
  //   }
  // }, [editor, isProviderReady]);

  return (
    <>
      <Helmet>
        <title>기획서</title>
      </Helmet>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 items-center justify-center flex containers">
          {providerRef.current && (
            <EditorContent className="w-full h-full" editor={editor} />
          )}
        </div>
      </div>
    </>
  );
}

export default ProposalPage;
