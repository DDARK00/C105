import { useState, useEffect, useRef, useCallback } from "react";
import useProjectStore from "../../store/useProjectStore";

const Sticker = ({ coordinate, onClick, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stickerRef = useRef(null);
  const { mainIdea } = useProjectStore();
  // 드래그 시작
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    // 현재 스티커의 위치와 마우스의 위치 차이를 offset으로 저장
    const stickerX = (e.clientX / window.innerWidth) * 100;
    const stickerY = (e.clientY / window.innerHeight) * 100;
    setOffset({
      x: stickerX - coordinate.x,
      y: stickerY - coordinate.y,
    });
  };

  // 드래그 중 위치 업데이트 (useCallback으로 메모이제이션)
  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const newX = (e.clientX / window.innerWidth) * 100 - offset.x;
      const newY = (e.clientY / window.innerHeight) * 100 - offset.y;

      if (stickerRef.current) {
        stickerRef.current.style.left = `${newX}%`;
        stickerRef.current.style.top = `${newY}%`;
      }
    },
    [isDragging, offset]
  );

  // 드래그 종료 시 위치 업데이트 (useCallback으로 메모이제이션)
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);

      const finalX = parseFloat(stickerRef.current.style.left);
      const finalY = parseFloat(stickerRef.current.style.top);

      onDragEnd(coordinate.ideaId, finalX.toFixed(2), finalY.toFixed(2));
    }
  }, [isDragging, onDragEnd, coordinate.ideaId]);

  // 전역 이벤트 리스너 추가 및 제거
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={stickerRef}
      className={`relative w-[100px] h-[100px] cursor-pointer transition-all z-10 ${coordinate.animation}`}
      style={{
        left: `${coordinate.x}%`,
        top: `${coordinate.y}%`,
        position: "absolute",
        cursor: isDragging ? "grabbing" : "pointer",
      }}
      onMouseDown={handleMouseDown}
      onClick={onClick}
    >
      {/* 선택된 상태에서 빛나는 보더 배경 */}
      {mainIdea.ideaId === coordinate.ideaId && (
        <div
          className="absolute inset-0 -m-1.5 bg-gradient-to-r from-red-500 via-blue-500 to-pink-500 animate-rotation z-0 pointer-events-none"
          style={{
            zIndex: -1, // 명시적으로 낮은 z-index 설정
          }}
        ></div>
      )}

      <div
        className="w-[100px] h-[84px] overflow-hidden z-20"
        style={{ backgroundColor: coordinate.color, marginBottom: "-1px" }}
      >
        <div className="px-2 py-2">
          <p
            className="text-gray-700 text-[8px]"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {coordinate.serviceName || "서비스 명을 입력해주세요"}
          </p>
        </div>
        <div className="px-2">
          <p
            className="text-gray-700 text-[9px]"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {coordinate.introduction || "서비스 소개를 입력해주세요"}
          </p>
        </div>
      </div>
      <div
        className="w-[84px] h-[16px] ml-auto mr-0 z-20"
        style={{ backgroundColor: coordinate.color }}
      ></div>
      <div
        className="absolute bottom-[0.3px] left-[0.1px] w-[16px] h-[16px] z-20"
        style={{
          backgroundColor: coordinate.darkColor,
          clipPath: "polygon(100% 100%, 100% 0, 0 0)",
        }}
      ></div>
      {/* 애니메이션 스타일 추가 */}
      <style>
        {`
          .animate-rotation {
            background: linear-gradient(
              to right,
              #ef4444,
              #3b82f6,
              #ec4899
            );
            background-size: 300% 100%;
            animation: gradient 2s linear infinite;
          }
          
          @keyframes gradient {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 150% 0%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Sticker;
