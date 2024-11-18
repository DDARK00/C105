import React, { useEffect, useRef, useState } from "react";

const DeepGlowingButton = ({ onClick }) => {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) return; // 호버 중이 아닐 경우 애니메이션 중지

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];
    const particleCount = 100;

    canvas.width = 200;
    canvas.height = 100;

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1; // 좌우 흔들림
        this.speedY = Math.random() * 2 + 1; // 아래로 흐름
        this.alpha = Math.random() * 0.8 + 0.2;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > canvas.height) {
          this.y = -10; // 버튼 영역 위로 다시 생성
          this.x = Math.random() * canvas.width;
          this.alpha = Math.random() * 0.8 + 0.2;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(222, 0, 0, ${this.alpha})`; // 붉은 느낌 강조
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(
        new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        )
      );
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      if (isHovered) requestAnimationFrame(animate); // 호버 중일 때만 애니메이션 유지
    };

    animate();
    return () => ctx.clearRect(0, 0, canvas.width, canvas.height); // 클린업
  }, [isHovered]);

  return (
    <>
      {isHovered && (
        <canvas
          ref={canvasRef}
          className="opacity-10 -z-10 pointer-events-none absolute right-0 top-0 -translate-y-1/3 translate-x-1/4"
          style={{
            width: "full",
            height: "full",
          }}
        />
      )}

      <button
        title="베타 기능입니다. "
        onMouseEnter={() => setIsHovered(true)} // 호버 시작
        onMouseLeave={() => setIsHovered(false)} // 호버 종료
        onClick={onClick}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 text-white font-bold rounded-full hover:from-blue-400 hover:via-cyan-300 hover:to-blue-400
        border-blue-800 focus:outline-none focus:ring-4 focus:ring-yellow-500"
      >
        <span className="text-xs tracking-wider uppercase">증식의 버튼</span>
      </button>
    </>
  );
};

export default DeepGlowingButton;
