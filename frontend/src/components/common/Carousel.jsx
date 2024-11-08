import React, { useState, useEffect } from "react";

const Carousel = ({ slides, currentIndex, setCurrentIndex, children }) => {
  // const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides?.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 자동 슬라이드 시간 (5초)

    return () => clearInterval(interval);
  }, [slides?.length, setCurrentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides?.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides?.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="rounded-md relative overflow-hidden w-full ">
      <div
        className="flex h-[200px] transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {/* 슬라이드 콘텐츠 */}
        {children}
      </div>

      {/* 이전/다음 버튼 */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
      >
        <i className="fa-solid fa-chevron-left text-white"></i>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
      >
        <i className="fa-solid fa-chevron-right text-white"></i>
      </button>
    </section>
  );
};

export default Carousel;
