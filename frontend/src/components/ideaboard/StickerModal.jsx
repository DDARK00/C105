import ModalPlanning from "./ModalPlanning";

// 각 메뉴별 내용을 표시할 컴포넌트

const StickerModal = ({ closeModal, selectedSticker }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="w-[95vw] h-[93vh] p-4 relative rounded-lg flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full h-full overflow-hidden"
          style={{ backgroundColor: selectedSticker.color }}
        >
          <ModalPlanning />
        </div>
        <button
          className="absolute text-3xl top-4 right-7 text-gray-500 hover:text-gray-700 z-[100]"
          onClick={closeModal}
        >
          <big>&times;</big>
        </button>
      </div>
    </div>
  );
};

export default StickerModal;
