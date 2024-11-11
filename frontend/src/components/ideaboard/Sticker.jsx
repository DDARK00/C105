import { useEffect, useState } from "react";

const Sticker = ({ delay, x, y, color, darkColor, onClick, animation }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // delay 시간 후에 애니메이션 활성화
    const timer = setTimeout(() => setAnimate(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`relative w-36 h-36 cursor-pointer transition-all z-10 ${
        animate ? animation : "opacity-0"
      }`}
      style={{ left: x, top: y }}
      onClick={onClick}
    >
      {/* 상단 메모 부분 */}
      <div
        className="w-36 h-[120px] overflow-hidden"
        style={{ backgroundColor: color, marginBottom: "-1px" }}
      >
        <div className="p-4">
          <p className="text-gray-700 text-xs">메모 내용을 입력하세요...</p>
        </div>
      </div>

      {/* 하단 바 부분 */}
      <div
        className="w-[120px] h-6 ml-auto mr-0"
        style={{ backgroundColor: color, marginTop: "-1.2px" }}
      ></div>

      {/* 왼쪽 하단 접힌 부분 */}
      <div
        className="absolute bottom-0 left-0 w-6 h-6"
        style={{
          backgroundColor: darkColor,
          clipPath: "polygon(100% 100%, 100% 0, 0 0)", // 삼각형 모양
          transform: "translate(0.2px, -0.7px)",
        }}
      ></div>
    </div>
  );
};

export default Sticker;
