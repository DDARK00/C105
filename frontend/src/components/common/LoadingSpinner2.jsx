import React from "react";

const LoadingSpinner2 = ({ message }) => {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
  ];

  return (
    <div className="flex w-full fixed top-0 left-0 z-[9999999] flex-col items-center justify-center h-screen">
      <style>
        {`
          @keyframes pingPulse {
            0%, 80%, 100% { transform: scale(1); opacity: 1; }
            40% { transform: scale(1.5); opacity: 0; }
          }
        `}
      </style>
      <div className="flex space-x-4 mb-8">
        {colors.map((color, index) => (
          <div key={index} className="relative w-8 h-8">
            <div
              className={`absolute w-8 h-8 ${color} rounded-full`}
              style={{
                animation: `pingPulse 2.5s ease-in-out infinite`,
                animationDelay: `${index * 0.5}s`,
              }}
            ></div>
            <div
              className={`absolute w-8 h-8 ${color} rounded-full opacity-30`}
            ></div>
          </div>
        ))}
      </div>
      <p className="text-lg font-medium text-gray-700">{message}</p>
    </div>
  );
};

export default LoadingSpinner2;
