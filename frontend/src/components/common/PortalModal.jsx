import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const PortalModal = ({ isOpen, onClose, children, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-6 rounded shadow-lg max-w-3xl w-full relative ${className} transform transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute text-2xl top-3 right-3 text-gray-500 hover:text-gray-700 z-50"
        >
          <big>&times;</big>
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
