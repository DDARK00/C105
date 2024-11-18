import React, { useEffect, useState } from "react";
import "@dineug/erd-editor";
import {
  useStorage,
  useMutation,
  useMyPresence,
  useOthers,
} from "@liveblocks/react";
import LoadingSpinner from "../common/LoadingSpinner";
import { CursorMode, colorName } from "../../global";
import { Cursor } from "../common/Cursor";

export function ERDDrawing() {
  const erdData = useStorage((root) => root.erdData);
  const [editor, setEditor] = useState(null);

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

  // Liveblocks에 ERD 데이터를 저장
  const updateERDData = useMutation(({ storage }, newData) => {
    const erdData = storage.get("erdData");
    erdData.set("tables", newData); // 새로운 데이터를 저장
  }, []);

  useEffect(() => {
    const container = document.querySelector("#app-erd");
    if (!container) return;
    if (editor) return;

    const initializeEditor = () => {
      if (container.children.item(0)) {
        container.removeChild(container.children.item(0));
      }

      const newEditor = document.createElement("erd-editor");
      newEditor.style.display = "block";
      newEditor.systemDarkMode = false;
      newEditor.style.maxHeight = "100%";
      newEditor.style.maxWidth = "100%";
      newEditor.style.position = "absolute";
      newEditor.style.top = 0;
      newEditor.style.left = 0;
      newEditor.style.zIndex = 1;
      newEditor.style.height = "100%";
      newEditor.style.width = "100%";
      newEditor.style.overflow = "hidden";

      // 기존 데이터 로드
      if (erdData && erdData.tables) {
        newEditor?.setInitialValue(erdData.tables); // erd-editor의 초기 값 설정
      }

      setEditor(newEditor);
      // 에디터의 데이터 변경 이벤트 처리
      const handleChange = () => {
        updateERDData(newEditor.value); // Liveblocks에 저장
      };
      newEditor.addEventListener("change", handleChange);

      container.appendChild(newEditor);
    };

    initializeEditor();

    // Cleanup
    return () => {
      if (editor) {
        editor.removeEventListener("change", () => updateERDData(editor.value)); // 이벤트 리스너 제거
        container.removeChild(editor); // DOM 정리
      }
    };
  }, [erdData, updateERDData, editor]);

  useEffect(() => {
    if (editor && erdData && erdData.tables) {
      editor.setInitialValue(erdData.tables);
    }
  }, [editor, erdData]);

  if (erdData === null) {
    return <LoadingSpinner />;
  }

  // 커서
  function handlePointerMove(e) {
    const windowWidth = window.innerWidth; // 화면 너비 가져오기
    const inputWidth = 290;

    // x 좌표를 제한
    const cursorX = Math.min(
      Math.floor(e.clientX), // 마우스 커서 위치
      windowWidth - inputWidth // 화면 너비 - input 너비
    );

    const cursorY = Math.floor(e.clientY); // y 좌표는 제한하지 않음

    const cursor = { x: cursorX, y: cursorY }; // 제한된 좌표로 커서 설정
    updateMyPresence({ cursor });
  }

  // 커서
  function handlePointerLeave(e) {
    updateMyPresence({ cursor: null });
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="w-full h-full flex flex-col"
    >
      <div className="flex-1 flex">
        <div className="relative flex-1" id="app-erd" />;
      </div>
      {cursor && (
        <div
          className="absolute top-0 left-0 z-10"
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
  );
}

export default ERDDrawing;
