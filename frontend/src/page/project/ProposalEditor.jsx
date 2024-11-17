import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useMyPresence, useOthers, useStorage } from "@liveblocks/react";
import { updateProposal } from "../../api/axios";
import "./ProposalEditor.css";
import { CursorMode, colorName } from "../../global";
import { Cursor } from "../../components/common/Cursor";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export function ProposalEditor() {
  const { ideaId } = useParams();
  // const [isEditorReady, setIsEditorReady] = useState(false); // 로딩 상태 초기화
  const liveblocks = useLiveblocksExtension({
    publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
  });

  const storage = useStorage((storage) => storage);
  const root = storage?.root ?? null;

  // 커서
  const [{ cursor }, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const [cursorState, setCursorState] = useState({ mode: CursorMode.Hidden });

  // 커서
  useEffect(() => {
    function onKeyUp(e) {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      }
    }

    window.addEventListener("keyup", onKeyUp);

    function onKeyDown(e) {
      if (e.key === "/") {
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        // focus: false,
      }),
      liveblocks,
    ],
    editorProps: {
      attributes: {
        class: "editor flex-1 flex h-full border rounded-lg p-2 !w-full",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      // setIsEditorReady(true);
      if (root && root.content !== content) {
        editor.commands.setTextSelection(null);
        root.set((prev) => ({ ...prev, content }));
      }
    },
    onCreate: () => {}, // 에디터가 생성되면 로딩 해제
  });

  // 텍스트 에디터
  useEffect(() => {
    if (editor && root && root.content) {
      // 내용이 존재하는 경우에만 setTextSelection을 설정
      setTimeout(() => {
        if (editor.getHTML().trim() !== "") {
          editor.commands.setTextSelection(null);
        }
      }, 50); // 약간의 지연을 줘서 선택 적용
    }
  }, [editor, root]);
  const saveContentToDB = useCallback(async (content, ideaId) => {
    try {
      const response = await updateProposal(ideaId, content);
      if (response.status === 200) {
        console.log("Document saved to the database.");
      } else {
        console.error("Failed to save content to DB:", response.status);
      }
    } catch (error) {
      console.error("Failed to save content to DB:", error);
    }
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      if (editor) {
        const finalContent = editor.getHTML();
        saveContentToDB(finalContent, ideaId);
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (editor) editor.destroy();
    };
  }, [editor, saveContentToDB, ideaId]);

  if (!storage) {
    return (
      <LoadingSpinner
        message={"기획서 페이지를 로딩중입니다. 잠시만 기다리세요"}
      />
    ); // 에디터가 준비되기 전까지 로딩 상태 표시
  }

  // 커서
  function handlePointerMove(e) {
    const cursor = { x: Math.floor(e.clientX), y: Math.floor(e.clientY) };
    updateMyPresence({ cursor });
  }

  // 커서
  function handlePointerLeave(e) {
    updateMyPresence({ cursor: null });
  }
  return (
    <>
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="h-full w-full max-w-full p-4"
      >
        {<EditorContent editor={editor} className="editor" />}

        {cursor && (
          <div
            className="absolute top-0 left-0"
            style={{
              transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
            }}
          >
            {cursorState.mode === CursorMode.Chat && (
              <>
                {/* <img src="cursor.svg" /> */}

                <div
                  className="absolute top-5 left-2 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white"
                  onKeyUp={(e) => e.stopPropagation()}
                  style={{
                    borderRadius: 20,
                  }}
                >
                  {cursorState.previousMessage && (
                    <div>{cursorState.previousMessage}</div>
                  )}
                  <input
                    className="w-60 border-none	bg-transparent text-white placeholder-blue-300 outline-none"
                    autoFocus={true}
                    onChange={(e) => {
                      updateMyPresence({ message: e.target.value });
                      setCursorState({
                        mode: CursorMode.Chat,
                        previousMessage: null,
                        message: e.target.value,
                      });
                    }}
                    onKeyDown={(e) => {
                      console.log(e.key, CursorMode.Chat);
                      if (e.key === "Enter") {
                        setCursorState({
                          mode: CursorMode.Chat,
                          previousMessage: cursorState.message,
                          message: "",
                        });
                      } else if (e.key === "Escape") {
                        setCursorState({
                          mode: CursorMode.Hidden,
                        });
                      }
                    }}
                    placeholder={
                      cursorState.previousMessage ? "" : "Say something…"
                    }
                    value={cursorState.message}
                    maxLength={50}
                  />
                </div>
              </>
            )}
          </div>
        )}
        {others.map(({ connectionId, presence }) => {
          if (presence == null || !presence.cursor) {
            return null;
          }

          return (
            <Cursor
              key={connectionId}
              color={colorName[connectionId % colorName.length]}
              x={presence.cursor.x}
              y={presence.cursor.y}
              message={presence.message}
            />
          );
        })}
      </div>
    </>
  );
}

export default ProposalEditor;
