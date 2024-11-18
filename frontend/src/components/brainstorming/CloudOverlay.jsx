import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchMindMapHotKeyword } from "../../api/axios";
import DeepGlowingButton from "./DeepGlowingButton";

const CloudOverlay = ({
  setIsPlanOpen,
  handleExtendClick,
  handleRecommend,
  setSearchKeyword,
}) => {
  const [textArray, setTextArray] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedRecommendText, setSelectedRecommendText] = useState("");

  // 핫 키워드 가져오기
  useEffect(() => {
    fetchMindMapHotKeyword().then((item) => {
      const getRandomElements = (arr, count) => {
        return arr
          ?.sort(() => Math.random() - 0.5) // 무작위로 섞기
          ?.slice(0, count); // 원하는 개수만큼 선택
      };
      if (item.length === 0) return;
      const randomFive = getRandomElements(item, 5);
      setTextArray(randomFive);
    });
  }, []);

  // selectedRecommendText 변경 시 handleRecommend 호출
  useEffect(() => {
    if (selectedRecommendText) {
      handleRecommend();
    }

    // handleRecommend이 계속 재생성되어 무한 호출을 방지하기 위해 의존성 배열에서 제외했습니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecommendText]);

  const containerRef = useRef(null);

  const handleClick = useCallback(
    (evt) => {
      evt?.preventDefault();
      if (!containerRef.current) return;

      // 모달이 열려 있을 때 -> 닫기 애니메이션 실행
      if (containerRef.current.classList.contains("modal-active")) {
        containerRef.current.classList.add("modal-out"); // 닫기 애니메이션 추가
        setVisible(false);
        // 닫기 애니메이션 후에 modal-active 클래스를 제거
        setTimeout(() => {
          containerRef.current.classList.remove("modal-active", "modal-out");
        }, 1000); // unfoldOut 애니메이션 시간(1s)과 동일하게 설정
        return;
      }

      // 모달이 닫혀 있을 때 -> 열기 애니메이션 실행
      setVisible(true);
      containerRef.current.classList.remove("modal-out");
      containerRef.current.classList.add("modal-active");
    },
    [containerRef]
  );

  const selectKeyword = useCallback(
    (text) => {
      if (text === selectedRecommendText) return;
      setSearchKeyword(text);
      setSelectedRecommendText(text);
      handleClick();
    },
    [selectedRecommendText, setSearchKeyword, handleClick]
  );

  return (
    <>
      <div className="text-end space-x-3 relative">
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 text-white font-bold rounded-full hover:from-blue-400 hover:via-cyan-300 hover:to-blue-400
        border-blue-800 focus:outline-none focus:ring-4 focus:ring-yellow-500"
        >
          <span className="text-xs tracking-wider uppercase">
            오늘의Keyword
          </span>
        </button>
        <button
          onClick={() => setIsPlanOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 text-white font-bold rounded-full hover:from-blue-400 hover:via-cyan-300 hover:to-blue-400
        border-blue-800 focus:outline-none focus:ring-4 focus:ring-yellow-500"
        >
          <span className="text-xs tracking-wider">AI Support</span>
        </button>

        <DeepGlowingButton onClick={handleExtendClick} />
      </div>
      <div className="flex items-center justify-center">
        <div
          title="클릭하면 창이 닫힙니다."
          ref={containerRef}
          onClick={handleClick}
          className={`z-50 fixed cursor-pointer table h-full w-full justify-center top-0 left-0 transform scale-0 transition-opacity duration-700`}
          style={{ backgroundColor: "#f0faff", opacity: 0.91 }}
        >
          <div className="table-cell bg-black/80 text-center align-middle modal-background">
            <div
              title=""
              onClick={(e) => e.stopPropagation()}
              className="bg-white cursor-auto p-12 inline-block rounded-lg relative modal"
            >
              <h2
                className="text-3xl font-bold mb-6 
              text-transparent bg-clip-text bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500"
              >
                오늘의 추천 키워드
              </h2>
              <div className="space-x-6">
                {visible &&
                  textArray.map((text, index) => (
                    <span
                      onClick={() => selectKeyword(text)}
                      key={index}
                      className="text-transparent cursor-pointer bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-5xl font-extrabold opacity-0"
                      style={{
                        animation: "textPop 1.5s ease forwards",
                        animationDelay: `${index * 0.4 + 1.5}s`,
                      }}
                    >
                      {text}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
.modal-active {
  overflow: hidden;
}
@keyframes textPop {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes unfoldIn {
  0% {
    transform: scaleY(0.005) scaleX(0);
  }
  50% {
    transform: scaleY(0.005) scaleX(1);
  }
  100% {
    transform: scaleY(1) scaleX(1);
  }
}

@keyframes unfoldOut {
  0% {
    transform: scaleY(1) scaleX(1);
  }
  50% {
    transform: scaleY(0.005) scaleX(1);
  }
  100% {
    transform: scaleY(0.005) scaleX(0);
  }
}

@keyframes zoomIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes zoomOut {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

.modal-active {
  transform: scaleY(0.01) scaleX(0);
  animation: unfoldIn 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.modal-active .modal-background .modal {
  transform: scale(0);
  animation: zoomIn 0.5s 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.modal-active.modal-out {
  transform: scale(1);
  animation: unfoldOut 1s 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.modal-active.modal-out .modal-background .modal {
  animation: zoomOut 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}
      `}</style>
      </div>
    </>
  );
};

export default CloudOverlay;
