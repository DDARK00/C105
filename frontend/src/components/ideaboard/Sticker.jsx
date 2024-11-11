const Sticker = ({ x, y, color, darkColor, onClick, animation }) => {
  return (
    <div
      className={`relative w-36 h-36 cursor-pointer transition-all z-10 ${animation}`}
      style={{
        left: x,
        top: y,
        position: "absolute",
      }}
      onClick={onClick}
    >
      <div
        className="w-36 h-[120px] overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <div className="p-4">
          <p className="text-gray-700 text-xs">메모 내용을 입력하세요...</p>
        </div>
      </div>
      <div
        className="w-[120px] h-6 ml-auto mr-0"
        style={{ backgroundColor: color }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-6 h-6"
        style={{
          backgroundColor: darkColor,
          clipPath: "polygon(100% 100%, 100% 0, 0 0)",
        }}
      ></div>
    </div>
  );
};

export default Sticker;
