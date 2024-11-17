import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const PortalModal = ({ isOpen, onClose, children, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden"; // 배경 스크롤 방지
    } else {
      setIsVisible(false);
      document.body.style.overflow = "auto"; // 스크롤 복원
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose} // 배경 클릭 시 모달 닫기
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative transform transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        } ${className}`}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫기 방지
        style={{ maxHeight: "90vh", overflowY: "auto" }} // 최대 높이 및 스크롤
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-700 z-10"
          aria-label="Close Modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("portal-root")
  );
};

export default PortalModal;
