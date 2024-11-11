import { Helmet } from "react-helmet-async";
import Sticker from "../../components/ideaboard/Sticker";
import { useEffect, useRef, useState } from "react";
import StickerModal from "../../components/ideaboard/StickerModal";
import DefaultButton from "../../components/common/DefaultButton";

function IdeaBoardPage() {
  const [selectedSticker, setSelectedSticker] = useState(null); // 선택된 스티커
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [scale, setScale] = useState(1); // 확대/축소 비율
  const [isDragging, setIsDragging] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 }); // 이동 비율
  const containerRef = useRef(null);

  useEffect(() => {
    console.log(selectedSticker);
  }, [selectedSticker]);
  useEffect(() => {
    // 기본 브라우저 확대/축소 막기
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

  // 첫 6개 좌표를 각 섹션 범위 내에서 랜덤으로 생성
  // const generateSectionCoordinates = () => {
  //   const coordinates = [
  //     { xRange: [0, 14], yRange: [0, 28] },
  //     { xRange: [28, 43], yRange: [0, 28] },
  //     { xRange: [57, 86], yRange: [0, 28] },
  //     { xRange: [0, 14], yRange: [41, 71] },
  //     { xRange: [28, 43], yRange: [41, 71] },
  //     { xRange: [57, 86], yRange: [41, 71] },
  //   ];

  //   return coordinates.map(({ xRange, yRange }, index) => ({
  //     x: `${xRange[0] + Math.random() * (xRange[1] - xRange[0])}%`,
  //     y: `${yRange[0] + Math.random() * (yRange[1] - yRange[0])}%`,
  //     delay: index * 100,
  //   }));
  // };

  // 나머지 좌표는 전체 범위에서 랜덤으로 생성
  // const generateRandomCoordinates = (count) => {
  //   const coordinates = [];
  //   for (let i = 0; i < count; i++) {
  //     coordinates.push({
  //       x: `${Math.random() * 86}%`, // x 범위 0% ~ 86%
  //       y: `${Math.random() * 71}%`, // y 범위 0% ~ 71%
  //       delay: (i + 6) * 100,
  //     });
  //   }
  //   return coordinates;
  // };

  // 첫 6개의 섹션 랜덤 좌표 + 나머지 전체 범위 랜덤 좌표
  const [coordinates, setCoordinates] = useState([
    // ...generateSectionCoordinates(),
    // ...generateRandomCoordinates(2),
    {
      x: "4%",
      y: "0%",
      delay: 0,
      color: "#FFF8B7",
      darkColor: "#E8DB78",
      animation: "animate-tinDownIn",
    },
    {
      x: "30%",
      y: "8%",
      delay: 100,
      color: "#CFF3FF",
      darkColor: "#A4E1F5",
      animation: "animate-tinUpIn",
    },
    {
      x: "67%",
      y: "20%",
      delay: 200,
      color: "#C6FFDC",
      darkColor: "#77FAA9",
      animation: "animate-tinRightIn",
    },
    {
      x: "8%",
      y: "70%",
      delay: 300,
      color: "#FCCDF7",
      darkColor: "#EF99E6",
      animation: "animate-tinLeftIn",
    },
    {
      x: "33%",
      y: "55%",
      delay: 400,
      color: "#E8CAFC",
      darkColor: "#D2A3F1",
      animation: "animate-tinDownIn",
    },
    {
      x: "86%",
      y: "41%",
      delay: 500,
      color: "#D2D2F8",
      darkColor: "#B1B1EE",
      animation: "animate-tinUpIn",
    },
    {
      x: "56%",
      y: "54%",
      delay: 600,
      color: "#FFF8B7",
      darkColor: "#E8DB78",
      animation: "animate-tinRightIn",
    },
    {
      x: "12%",
      y: "38%",
      delay: 700,
      color: "#CFF3FF",
      darkColor: "#A4E1F5",
      animation: "animate-tinLeftIn",
    },
    {
      x: "40%",
      y: "71%",
      delay: 800,
      color: "#C6FFDC",
      darkColor: "#77FAA9",
      animation: "animate-tinDownIn",
    },
  ]);

  // 애니메이션
  const animations = [
    "animate-tinDownIn",
    "animate-tinUpIn",
    "animate-tinRightIn",
    "animate-tinLeftIn",
  ];

  // 색상 배열 정의
  const colors = [
    "#FFF8B7",
    "#CFF3FF",
    "#C6FFDC",
    "#FCCDF7",
    "#E8CAFC",
    "#D2D2F8",
  ];

  const darkColors = [
    "#E8DB78",
    "#A4E1F5",
    "#77FAA9",
    "#EF99E6",
    "#D2A3F1",
    "#B1B1EE",
  ];

  // 스티커 클릭 시 선택 상태로 변경
  const handleStickerClick = (index) => {
    setSelectedSticker(coordinates[index]);
  };

  // 스티커 추가 함수
  const handleAddSticker = () => {
    console.log("아이디어(스티커) 생성");
  };

  // 스티커 삭제 함수
  const handleDeleteSticker = () => {
    if (selectedSticker) {
      setCoordinates((prev) =>
        prev.filter((sticker) => sticker !== selectedSticker)
      );
      setSelectedSticker(null); // 삭제 후 선택 해제
    }
  };

  // 마우스로 화면을 드래그하여 이동하는 기능
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault(); // 기본 마우스 동작(텍스트 선택 등)을 방지
    const startX = e.clientX; // 드래그 시작 X 좌표
    const startY = e.clientY; // 드래그 시작 Y 좌표
    const startTranslate = { ...translate }; // 현재 이동 상태 저장

    // 마우스를 움직일 때 호출되는 함수
    const handleMouseMove = (moveEvent) => {
      const dx = ((moveEvent.clientX - startX) / scale) * 2; // X축 이동 거리, 확대/축소 비율 반영
      const dy = ((moveEvent.clientY - startY) / scale) * 2; // Y축 이동 거리, 확대/축소 비율 반영

      // 부모 요소의 크기를 참조하여 화면 경계 설정
      const { offsetWidth: parentWidth, offsetHeight: parentHeight } =
        containerRef.current;

      // 확대된 상태에 따른 X축 최대 이동 범위
      const maxTranslateX = (parentWidth * scale - parentWidth) / 2;
      // 확대된 상태에 따른 Y축 최대 이동 범위
      const maxTranslateY = (parentHeight * scale - parentHeight) / 2;

      // translate 값을 화면 경계 내로 제한하여 이동
      setTranslate({
        x: Math.max(
          -maxTranslateX, // 최소 X값
          Math.min(startTranslate.x + dx, maxTranslateX) // 최대 X값
        ),
        y: Math.max(
          -maxTranslateY, // 최소 Y값
          Math.min(startTranslate.y + dy, maxTranslateY) // 최대 Y값
        ),
      });
    };

    // 마우스 버튼을 떼었을 때 이벤트 리스너를 제거하는 함수
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove); // 마우스 이동 이벤트 제거
      window.removeEventListener("mouseup", handleMouseUp); // 마우스 버튼 떼기 이벤트 제거
    };

    // 드래그 시작 시 이벤트 리스너 추가
    window.addEventListener("mousemove", handleMouseMove); // 마우스 이동 감지
    window.addEventListener("mouseup", handleMouseUp); // 마우스 버튼 떼기 감지
  };

  // 확대/축소를 처리하는 함수
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      // ctrl 키와 함께 휠을 움직일 때만 확대/축소 적용
      e.preventDefault(); // 기본 확대/축소 동작 막기
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
            ({ x, y, delay, color, darkColor, animation }, index) => (
              <div
                key={index}
                className="relative"
                style={{ left: x, top: y, position: "absolute" }}
              >
                <Sticker
                  delay={delay}
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
                      top: "-1.2rem", // 스티커의 상단에서 약간 위로
                      left: "4.5rem", // 스티커의 중심을 기준으로 위치
                      transform: "translate(-50%, -50%)", // 중앙 정렬 및 약간 위로 이동
                    }}
                  >
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs whitespace-nowrap"
                      style={{ minWidth: "60px" }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      상세보기
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs whitespace-nowrap"
                      style={{ minWidth: "60px" }}
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
            width="30"
            height="30"
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
              height: `${((scale - 1) / 2) * 100}%`, // scale을 기반으로 높이 설정
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
