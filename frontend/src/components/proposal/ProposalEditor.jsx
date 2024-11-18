import {
  useMutation,
  useMyPresence,
  useOthers,
  useStorage,
} from "@liveblocks/react";
import MDEditor from "@uiw/react-md-editor";
import mermaid from "mermaid";
import { Children, isValidElement, useEffect, useRef, useState } from "react";
import { CursorMode, colorName } from "../../global";
import { Cursor } from "../common/Cursor";

// Markdown에서 코드를 추출하는 함수
const getCode = (arr = []) =>
  Children.toArray(arr)
    ?.map((dt) => {
      if (typeof dt === "string") {
        return dt;
      }
      if (isValidElement(dt) && dt.props && dt.props.children) {
        return getCode(dt.props.children);
      }
      return false;
    })
    .filter(Boolean)
    .join("");

// Mermaid 코드 렌더링을 위한 Code 컴포넌트
function Code({ inline, children = [], className, ...props }) {
  const demoid = useRef(
    `dome${parseInt(String(Math.random() * 1e15), 10).toString(36)}`
  );
  const code = getCode(children);
  // console.log("Extracted code:", code);

  const demo = useRef(null);

  useEffect(() => {
    const renderMermaid = async () => {
      if (demo.current && code) {
        try {
          const { svg } = await mermaid.render(demoid.current, code);
          demo.current.innerHTML = svg;
        } catch (error) {
          demo.current.innerHTML = "Invalid syntax";
        }
      }
    };
    renderMermaid();
  }, [code]);
  if (
    typeof code === "string" &&
    typeof className === "string" &&
    /^language-mermaid/.test(className.toLowerCase())
  ) {
    return (
      <div ref={demo}>
        <div id={demoid.current} style={{ display: "none" }} />
      </div>
    );
  }
  return <code className={String(className)}>{children}</code>;
}

function ProposalEditor() {
  const storage = useStorage((root) => root.fieldValues);

  const updateMarkdown = useMutation(({ storage }, value) => {
    const proposal = storage.get("fieldValues");
    proposal.set("content", value);
  }, []);

  // 커서
  const [{ cursor }, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const [cursorState, setCursorState] = useState({ mode: CursorMode.Hidden });

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

  if (storage === null) {
    return (
      <div className="flex-1 w-full h-full p-4 bg-gray-100">
        {/* 스켈레톤 편집기 영역 */}
        <div className="w-full h-[675px] rounded border bg-gray-200 animate-pulse p-4">
          <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-4/6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
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
    <>
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="h-full w-full flex flex-col"
      >
        <div className="flex-1 w-full h-full p-4 bg-gray-100">
          <MDEditor
            value={storage?.content}
            onChange={updateMarkdown}
            textareaProps={{
              placeholder: "Mermaid 문법을 사용해 기획서를 작성하세요.",
            }}
            height={675}
            previewOptions={{
              components: {
                code: Code,
              },
            }}
          />
        </div>

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
