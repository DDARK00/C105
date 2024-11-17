import { useState, useEffect } from "react";
import {
  useMutation,
  useMyPresence,
  useOthers,
  useStorage,
} from "@liveblocks/react";
import { CursorMode, colorName } from "../../global";
import { Cursor } from "../common/Cursor";
import LoadingSpinner from "../common/LoadingSpinner";

function RequirementsTable() {
  const storage = useStorage((storage) => storage.requirements); // 항상 최상위에서 호출
  const columnWidths = {
    status: 150,
    relatedPage: 150,
    isRequired: 150,
    name: 150,
    description: 300,
    author: 150,
  };

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

  // 커서
  function handlePointerMove(e) {
    const cursor = { x: Math.floor(e.clientX), y: Math.floor(e.clientY) };
    updateMyPresence({ cursor });
  }

  // 커서
  function handlePointerLeave(e) {
    updateMyPresence({ cursor: null });
  }
  // --커서 끝 ---

  const handleChange = useMutation(({ storage }, id, field, value) => {
    const requirements = storage.get("requirements");
    const index = requirements.findIndex((req) => req.id === id);
    if (index !== -1) {
      requirements.set(index, { ...requirements.get(index), [field]: value });
    }
  }, []);

  const handleAddRow = useMutation(({ storage }) => {
    const requirements = storage.get("requirements");
    console.log(requirements.toArray());
    requirements.push({
      id: Date.now(),
      status: "미진행",
      relatedPage: "",
      isRequired: "필수 기능",
      name: "",
      description: "",
      author: "",
    });
    // setLocalRequirements(requirements.toArray()); // localRequirements 업데이트
  }, []);

  // const handleResize = (column, e) => {
  //   const startX = e.clientX;
  //   const startWidth = columnWidths[column];

  //   const onMouseMove = (e) => {
  //     const newWidth = Math.max(startWidth + e.clientX - startX, 50);
  //     columnWidths[column] = newWidth; // 컬럼 너비 업데이트
  //     storage.set("columnWidths", columnWidths);
  //   };

  //   const onMouseUp = () => {
  //     document.removeEventListener("mousemove", onMouseMove);
  //     document.removeEventListener("mouseup", onMouseUp);
  //   };

  //   document.addEventListener("mousemove", onMouseMove);
  //   document.addEventListener("mouseup", onMouseUp);
  // };
  // storage가 초기화되지 않은 경우 로딩 상태 표시
  if (!storage) {
    return (
      <LoadingSpinner
        message={"요구사항 명세서를 로드 중입니다. 잠시만 기다려주세요!"}
      />
    );
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="h-full w-full flex flex-col"
    >
      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {Object.keys(columnWidths)?.map((column) => (
                <th
                  key={column}
                  className="p-1 relative"
                  style={{ width: columnWidths[column] }}
                >
                  {column === "status" && "구현"}
                  {column === "relatedPage" && "관련 페이지"}
                  {column === "isRequired" && "필수 여부"}
                  {column === "name" && "요구사항 명"}
                  {column === "description" && "상세 설명"}
                  {column === "author" && "작성자"}
                  <span
                    // onMouseDown={(e) => handleResize(column, e)}
                    className="absolute right-0 top-1 h-full cursor-col-resize px-1 text-slate-200"
                    title="너비 조정 가능"
                  >
                    &#x22EE;
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {storage.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="p-2" style={{ width: columnWidths.status }}>
                  <select
                    value={req.status}
                    onChange={(e) =>
                      handleChange(req.id, "status", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  >
                    <option value="미진행">미진행</option>
                    <option value="진행중">진행중</option>
                    <option value="완료">완료</option>
                  </select>
                </td>
                <td className="p-2" style={{ width: columnWidths.relatedPage }}>
                  <input
                    type="text"
                    value={req.relatedPage}
                    onChange={(e) =>
                      handleChange(req.id, "relatedPage", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  />
                </td>
                <td className="p-2" style={{ width: columnWidths.isRequired }}>
                  <select
                    value={req.isRequired}
                    onChange={(e) =>
                      handleChange(req.id, "isRequired", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  >
                    <option value="필수 기능">필수 기능</option>
                    <option value="부가 기능">부가 기능</option>
                  </select>
                </td>
                <td className="p-2" style={{ width: columnWidths.name }}>
                  <input
                    type="text"
                    value={req.name}
                    onChange={(e) =>
                      handleChange(req.id, "name", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  />
                </td>
                <td className="p-2" style={{ width: columnWidths.description }}>
                  <input
                    type="text"
                    value={req.description}
                    onChange={(e) =>
                      handleChange(req.id, "description", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  />
                </td>
                <td className="p-2" style={{ width: columnWidths.author }}>
                  <input
                    type="text"
                    value={req.author}
                    onChange={(e) =>
                      handleChange(req.id, "author", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleAddRow}
          className="mt-4 ms-2 px-4 py-2 text-gray-500 border rounded-md hover:bg-gray-200 transition duration-200 ease-in-out"
        >
          + 추가하기
        </button>
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

export default RequirementsTable;
