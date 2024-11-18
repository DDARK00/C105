import React, { useEffect, useState } from "react";

const LoadingSpinner = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCenterHovered, setIsCenterHovered] = useState(false);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-gray-100"
      onMouseEnter={() => setIsHovered(true)} // 전체 스피너 호버
      onMouseLeave={() => setIsHovered(false)} // 전체 스피너에서 벗어날 때
    >
      {/* 스피너 */}
      <div
        className={`relative w-24 h-24 mb-6 transition-transform duration-300 ${
          isHovered ? "scale-125 rotate-45" : ""
        }`}
      >
        {/* 회전하는 원 */}
        <div
          className={`absolute inset-0 border-4 ${
            isCenterHovered
              ? "border-t-purple-600 border-r-pink-600 border-b-yellow-600 border-l-red-600"
              : isHovered
              ? "border-t-pink-500 border-r-purple-500 border-b-teal-500 border-l-orange-500"
              : "border-t-blue-500 border-r-green-500 border-b-red-500 border-l-yellow-500"
          } rounded-full ${
            isCenterHovered ? "animate-spin-fast" : "animate-spin"
          }`}
        ></div>

        {/* 가운데 점들이 회전 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`absolute w-4 h-4 rounded-full ${
                isHovered ? "bg-pink-500" : "bg-blue-500"
              } transform scale-75 animate-ping`}
              style={{
                transform: `rotate(${index * 90}deg) translate(1.5rem)`,
                animationDelay: `${index * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* 중앙 점 */}
        <div
          className={`absolute inset-0 flex items-center justify-center cursor-pointer`}
          onMouseEnter={() => setIsCenterHovered(true)} // 중앙 원에 호버
          onMouseLeave={() => setIsCenterHovered(false)} // 중앙 원에서 벗어날 때
        >
          <div
            className={`w-4 h-4 rounded-full ${
              isCenterHovered
                ? "bg-purple-600 scale-150"
                : isHovered
                ? "bg-pink-500 scale-125"
                : "bg-blue-500"
            } animate-bounce`}
          ></div>
        </div>
      </div>

      {/* 텍스트 */}
      <p
        className={`text-xl font-bold transition-all duration-300 ${
          isCenterHovered
            ? "text-purple-600 text-2xl animate-pulse-fast"
            : isHovered
            ? "text-pink-500 animate-bounce"
            : "text-gray-600 animate-pulse"
        }`}
      >
        {isCenterHovered ? "🔥 열정을 불태우는 중... 🚀" : "로딩 중... 🚀"}
      </p>
      <style>
        {`
        @keyframes spin-fast {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-fast {
  animation: spin-fast 0.5s linear infinite; /* 빠르게 회전 */
}

        @keyframes pulse-fast {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-pulse-fast {
  animation: pulse-fast 0.4s infinite;
}`}
      </style>
    </div>
  );
};

export default LoadingSpinner;
