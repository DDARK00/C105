import { useState, useEffect } from "react";
import {
  useMutation,
  useMyPresence,
  useOthers,
  useStorage,
} from "@liveblocks/react";
import { CursorMode, colorName } from "../../global";
import { Cursor } from "../common/Cursor";
import EnhancedModal from "./EnhancedModal";
import ApiSpecTableSkeleton from "../skeleton/ApiSpecTableSkeleton";

function ApiSpecTable() {
  const storage = useStorage((storage) => storage.apiSpecifications); // apiSpecifications 저장소 접근
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(null);

  const columnWidths = {
    feature: 150,
    domain: 150,
    method: 100,
    uri: 200,
    importance: 100,
    backendOwner: 150,
    frontendOwner: 150,
    memo: 200,
  };

  // 커서
  const [{ cursor }, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const [cursorState, setCursorState] = useState({ mode: CursorMode.Hidden });

  // 커서
  useEffect(() => {
    // console.log(others);
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
  // --커서 끝 ---

  const handleAddRow = useMutation(({ storage }) => {
    const apiSpecifications = storage.get("apiSpecifications");
    apiSpecifications.push({
      id: Date.now(),
      feature: "",
      domain: "",
      method: "GET",
      uri: "",
      importance: "Low",
      backendOwner: "",
      frontendOwner: "",
      memo: "",
    });
  }, []);

  const handleChange = useMutation(({ storage }, id, field, value) => {
    const apiSpecifications = storage.get("apiSpecifications");
    const index = apiSpecifications.findIndex((spec) => spec.id === id);
    if (index !== -1) {
      apiSpecifications.set(index, {
        ...apiSpecifications.get(index),
        [field]: value,
      });
    }
  }, []);

  // 모달 열기
  const openModal = (spec) => {
    setSelectedSpec(spec); // 선택된 spec 데이터 저장
    setIsModalOpen(true); // 모달 열기
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpec(null);
  };

  const handleLiveChange = useMutation(
    ({ storage }, field, value) => {
      const apiSpecifications = storage.get("apiSpecifications");
      const index = apiSpecifications.findIndex(
        (spec) => spec.id === selectedSpec.id
      );
      if (index !== -1) {
        apiSpecifications.set(index, {
          ...apiSpecifications.get(index),
          [field]: value,
        });
      }
    },
    [selectedSpec]
  );
  if (storage === null) {
    return <ApiSpecTableSkeleton columnWidths={columnWidths} />;
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
                  className="p-2 relative"
                  style={{ width: columnWidths[column] }}
                >
                  {column === "feature" && "기능"}
                  {column === "domain" && "도메인"}
                  {column === "method" && "Method"}
                  {column === "uri" && "URI"}
                  {column === "importance" && "중요도"}
                  {column === "backendOwner" && "BE"}
                  {column === "frontendOwner" && "FE"}
                  {column === "memo" && "메모"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {storage.map((spec) => (
              <tr key={spec.id} className="hover:bg-gray-50">
                <td className="p-2" style={{ width: columnWidths.feature }}>
                  <input
                    type="text"
                    value={spec.feature}
                    onChange={(e) =>
                      handleChange(spec.id, "feature", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  />
                </td>
                <td className="p-2" style={{ width: columnWidths.domain }}>
                  <input
                    type="text"
                    value={spec.domain}
                    onChange={(e) =>
                      handleChange(spec.id, "domain", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  />
                </td>
                <td className="p-2" style={{ width: columnWidths.method }}>
                  <select
                    value={spec.method}
                    onChange={(e) =>
                      handleChange(spec.id, "method", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </td>
                <td
                  className="cursor-pointer text-blue-500 text-center"
                  onClick={() => openModal(spec)} // URI 클릭 시 모달 열기
                >
                  {spec.uri || "URI 입력"}
                </td>
                <td className="p-2" style={{ width: columnWidths.importance }}>
                  <select
                    value={spec.importance}
                    onChange={(e) =>
                      handleChange(spec.id, "importance", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </td>
                <td
                  className="p-2"
                  style={{ width: columnWidths.backendOwner }}
                >
                  <input
                    type="text"
                    value={spec.backendOwner}
                    onChange={(e) =>
                      handleChange(spec.id, "backendOwner", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  />
                </td>
                <td
                  className="p-2"
                  style={{ width: columnWidths.frontendOwner }}
                >
                  <input
                    type="text"
                    value={spec.frontendOwner}
                    onChange={(e) =>
                      handleChange(spec.id, "frontendOwner", e.target.value)
                    }
                    className="w-full p-1 rounded border-b focus:outline-none"
                  />
                </td>
                <td className="p-2" style={{ width: columnWidths.memo }}>
                  <input
                    type="text"
                    value={spec.memo}
                    onChange={(e) =>
                      handleChange(spec.id, "memo", e.target.value)
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
        {/* 모달 */}
        <EnhancedModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedSpec={selectedSpec}
          formData={selectedSpec}
          handleLiveChange={handleLiveChange}
          onSubmit={closeModal} // 저장 후 닫기
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
                    // console.log(e.key, CursorMode.Chat);
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

export default ApiSpecTable;
