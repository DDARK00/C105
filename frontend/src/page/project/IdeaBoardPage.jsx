import { Helmet } from "react-helmet-async";
import Sticker from "../../components/ideaboard/Sticker";
import { useCallback, useEffect, useRef, useState } from "react";
import StickerModal from "../../components/ideaboard/StickerModal";
import DefaultButton from "../../components/common/DefaultButton";
import { createIdea, deleteIdea, fetchIdea } from "../../api/axios";
import { useParams } from "react-router-dom";

function IdeaBoardPage() {
  const param = useParams();
  const [selectedSticker, setSelectedSticker] = useState(null); // 선택된 스티커
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [scale, setScale] = useState(1); // 확대/축소 비율
  const [isDragging, setIsDragging] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 }); // 이동 비율
  const [spacePressed, setSpacePressed] = useState(false);
  const containerRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]); // 스티커 상태

  // 기본 브라우저 확대/축소 막기
  useEffect(() => {
    const preventDefaultZoom = (e) => {
      if (e.ctrlKey && e.type === "wheel") {
        e.preventDefault();
      } else if (e.ctrlKey && (e.key === "=" || e.key === "-")) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", preventDefaultZoom, { passive: false });
    window.addEventListener("keydown", preventDefaultZoom, { passive: false });
    return () => {
      window.removeEventListener("wheel", preventDefaultZoom);
      window.removeEventListener("keydown", preventDefaultZoom);
    };
  }, []);

  // 마우스로 화면 끌 때 스페이스바 누르고 움직임
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        setSpacePressed(true); // 스페이스바 눌림 상태
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === " ") {
        setSpacePressed(false); // 스페이스바 떼짐 상태
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const fetchIdeas = useCallback(async () => {
    const data = await fetchIdea(param?.id);
    if (data) {
      setCoordinates(data);
    }
  }, [param?.id]);

  // 아이디어 목록 조회
  useEffect(() => {
    fetchIdeas();
  }, [param?.id, fetchIdeas]);

  // 스티커 클릭 시 선택 상태 변경
  const handleStickerClick = (index) => {
    setSelectedSticker(coordinates[index]);
  };

  // 스티커 추가 함수
  const handleAddSticker = async () => {
    await createIdea(param?.id);
    fetchIdeas();
  };

  // 스티커 삭제 함수
  const handleDeleteSticker = async () => {
    await deleteIdea(selectedSticker?.ideaId);
    fetchIdeas();
    setSelectedSticker(null); // 선택된 스티커 초기화
  };

  // 마우스로 화면을 드래그하여 이동하는 기능
  const handleMouseDown = (e) => {
    if (!spacePressed) return; // 스페이스바가 눌린 상태에서만 화면 이동 활성화

    setIsDragging(true);
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startTranslate = { ...translate };

    const handleMouseMove = (moveEvent) => {
      const dx = ((moveEvent.clientX - startX) / scale) * 2;
      const dy = ((moveEvent.clientY - startY) / scale) * 2;

      const { offsetWidth: parentWidth, offsetHeight: parentHeight } =
        containerRef.current;

      const maxTranslateX = (parentWidth * scale - parentWidth) / 2;
      const maxTranslateY = (parentHeight * scale - parentHeight) / 2;

      setTranslate({
        x: Math.max(
          -maxTranslateX,
          Math.min(startTranslate.x + dx, maxTranslateX)
        ),
        y: Math.max(
          -maxTranslateY,
          Math.min(startTranslate.y + dy, maxTranslateY)
        ),
      });
    };

    // 마우스 버튼을 떼었을 때 이벤트 리스너를 제거하는 함수
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove); // 마우스 이동 이벤트 제거
      window.removeEventListener("mouseup", handleMouseUp); // 마우스 버튼 떼기 이벤트 제거
    };

    window.addEventListener("mousemove", handleMouseMove); // 마우스 이동 감지
    window.addEventListener("mouseup", handleMouseUp); // 마우스 버튼 떼기 감지
  };

  // 확대/축소를 처리하는 함수
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      // ctrl 키와 함께 휠을 움직일 때만 확대/축소 적용
      const zoomIntensity = 0.2; // 확대/축소 강도
      let newScale = scale - e.deltaY * zoomIntensity * 0.01; // 스케일 조정
      newScale = Math.min(Math.max(newScale, 1), 3); // 스케일을 최소 1배, 최대 3배로 제한

      // 부모 요소의 크기를 참조하여 새 스케일에 맞는 이동 범위 설정
      const { offsetWidth: parentWidth, offsetHeight: parentHeight } =
        containerRef.current;
      const maxTranslateX = (parentWidth * newScale - parentWidth) / 2; // X축 최대 이동 범위
      const maxTranslateY = (parentHeight * newScale - parentHeight) / 2; // Y축 최대 이동 범위

      // 스케일 조정 후에도 이동 범위가 경계를 넘지 않도록 translate 값을 제한
      setTranslate((prevTranslate) => ({
        x: Math.max(-maxTranslateX, Math.min(prevTranslate.x, maxTranslateX)), // X축 경계 설정
        y: Math.max(-maxTranslateY, Math.min(prevTranslate.y, maxTranslateY)), // Y축 경계 설정
      }));

      setScale(newScale); // 확대/축소 비율 업데이트
    }
  };

  // 확대/축소 버튼 클릭 핸들러
  const handleZoom = (zoomIn) => {
    let newScale = zoomIn ? scale + 0.2 : scale - 0.2;
    newScale = Math.min(Math.max(newScale, 1), 3);
    updateTranslate(newScale);
  };

  // scale 값이 변경될 때 translate 값을 업데이트하는 함수
  const updateTranslate = (newScale) => {
    const { offsetWidth: parentWidth, offsetHeight: parentHeight } =
      containerRef.current;
    const maxTranslateX = (parentWidth * newScale - parentWidth) / 2;
    const maxTranslateY = (parentHeight * newScale - parentHeight) / 2;

    setTranslate((prevTranslate) => ({
      x: Math.max(-maxTranslateX, Math.min(prevTranslate.x, maxTranslateX)),
      y: Math.max(-maxTranslateY, Math.min(prevTranslate.y, maxTranslateY)),
    }));

    setScale(newScale);
  };
  return (
    <>
      <Helmet>
        <title>아이디어보드 페이지</title>
      </Helmet>
      <div
        ref={containerRef}
        className={`relative overflow-hidden w-full h-full ${
          isDragging ? "cursor-grab" : ""
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <div
          className="relative w-full h-full origin-center"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            background:
              "radial-gradient(circle, #a5a5a5 1px, transparent 1px) 0 0 / 20px 20px",
          }}
        >
          {coordinates.map(
            ({ ideaId, x, y, color, darkColor, animation }, index) => (
              <div
                key={ideaId}
                style={{ left: `${x}%`, top: `${y}%`, position: "absolute" }}
              >
                <Sticker
                  x={`${x}%`}
                  y={`${y}%`}
                  color={color}
                  darkColor={darkColor}
                  animation={animation}
                  isSelected={coordinates[index] === selectedSticker}
                  onClick={() => handleStickerClick(index)}
                />
                {coordinates[index] === selectedSticker && (
                  <div
                    className="absolute flex flex-row items-center space-x-2 z-10"
                    style={{
                      top: "-1.2rem",
                      left: "5rem",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs whitespace-nowrap"
                      onClick={() => setIsModalOpen(true)}
                    >
                      상세보기
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs whitespace-nowrap"
                      onClick={handleDeleteSticker}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
      {isModalOpen && selectedSticker && (
        <StickerModal
          closeModal={() => setIsModalOpen(false)}
          selectedSticker={selectedSticker}
        />
      )}
      {/* 아이디어(스티커) 추가 */}
      <DefaultButton
        onClick={handleAddSticker}
        type="button"
        text={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12.998H13V18.998H11V12.998H5V10.998H11V4.99805H13V10.998H19V12.998Z"
              fill="white"
            />
          </svg>
        }
        className="fixed top-20 right-4"
        theme="default"
      />
      {/* 확대/축소 컨트롤러: transform 외부에 위치 */}
      <div className="fixed right-4 top-[25%] -translate-y-1/2 flex flex-col items-center gap-2 bg-white rounded-lg p-2 shadow-md select-none">
        <button
          onClick={() => handleZoom(true)}
          className="text-lg font-semibold text-gray-700"
          title={"ctrl을 누르고 마우스휠을 위로 굴리면 확대가 됩니다"}
        >
          +
        </button>
        <div className="relative w-1 h-24 bg-gray-300 rounded overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-blue-500 transition-all duration-200 ease-in-out"
            style={{
              height: `${((scale - 1) / 2) * 100} %`, // scale을 기반으로 높이 설정
            }}
          />
        </div>
        <button
          onClick={() => handleZoom(false)}
          className="text-lg font-semibold text-gray-700"
          title={"ctrl을 누르고 마우스휠을 아래로 굴리면 축소가 됩니다"}
        >
          -
        </button>
      </div>
    </>
  );
}

export default IdeaBoardPage;
