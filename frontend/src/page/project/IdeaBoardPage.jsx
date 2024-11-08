import { Helmet } from "react-helmet-async";
import Sticker from "../../components/ideaboard/Sticker";
import { useEffect, useRef, useState } from "react";
import StickerModal from "../../components/ideaboard/StickerModal";

function IdeaBoardPage() {
  const [selectedSticker, setSelectedSticker] = useState(null); // 선택된 스티커
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [scale, setScale] = useState(1); // 확대/축소 비율
  const [isDragging, setIsDragging] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 }); // 이동 비율
  const containerRef = useRef(null);

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
  const coordinates = [
    // ...generateSectionCoordinates(),
    // ...generateRandomCoordinates(2),
    { x: "4%", y: "0%", delay: 0 },
    { x: "30%", y: "8%", delay: 100 },
    { x: "67%", y: "20%", delay: 200 },
    { x: "8%", y: "70%", delay: 300 },
    { x: "33%", y: "55%", delay: 400 },
    { x: "86%", y: "41%", delay: 500 },
    { x: "56%", y: "54%", delay: 600 },
    { x: "12%", y: "38%", delay: 700 },
    { x: "40%", y: "71%", delay: 800 },
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

  // 스티커 모달을 여는 함수 - 스티커를 클릭했을 때 호출
  const openModal = (sticker) => {
    setSelectedSticker(sticker); // 선택된 스티커 정보를 상태에 저장
    setIsModalOpen(true); // 모달 열기
  };

  // 스티커 모달을 닫는 함수 - 모달을 닫는 버튼이나 배경을 클릭했을 때 호출
  const closeModal = () => {
    setSelectedSticker(null); // 선택된 스티커 정보를 초기화
    setIsModalOpen(false); // 모달 닫기
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
          {coordinates.map(({ x, y, delay }, index) => (
            <Sticker
              key={index}
              x={x}
              y={y}
              delay={delay}
              color={colors[index % colors.length]}
              darkColor={darkColors[index % darkColors.length]}
              onClick={() =>
                openModal({
                  x,
                  y,
                  color: colors[index % colors.length],
                  darkColor: darkColors[index % darkColors.length],
                })
              }
            />
          ))}
        </div>
      </div>
      {isModalOpen && selectedSticker && (
        <StickerModal
          closeModal={closeModal}
          selectedSticker={selectedSticker}
        />
      )}
      {/* 확대/축소 컨트롤러: transform 외부에 위치 */}
      <div className="fixed right-4 top-[30%] -translate-y-1/2 flex flex-col items-center gap-2 bg-white rounded-lg p-2 shadow-md select-none">
        <button
          onClick={() => handleZoom(true)}
          className="text-lg font-semibold text-gray-700"
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
        >
          -
        </button>
      </div>
    </>
  );
}

export default IdeaBoardPage;
