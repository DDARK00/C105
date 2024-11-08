import { useState } from "react";

function SearchBar({
  handleSearch,
  setSearchKeyword,
  searchKeyword,
  handleInfoClick,
}) {
  const [isSearchAnimation, setIsSearchAnimation] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const search = () => {
    handleSearch(searchKeyword);
    setIsSearchAnimation(true);
    setTimeout(() => setIsSearchAnimation(false), 500);
  };
  return (
    <>
      {/* 검색창 */}
      <div className="flex justify-center my-8">
        <div
          className={`w-full max-w-2xl  transition-all rounded-full p-1 ${
            isFocused
              ? "bg-gradient-to-r from-red-500 via-blue-500 to-pink-500 animate-rotation"
              : "bg-gray-700"
          }`}
        >
          <input
            id="searchInput"
            type="text"
            onKeyDown={(e) =>
              e.key === "Enter" ? search(e.target.value) : null
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setSearchKeyword(e.target.value)}
            value={searchKeyword}
            autoComplete="off"
            placeholder="여기에 검색어를 입력하세요"
            className="w-full max-w-2xl p-3 pl-5  rounded-3xl border border-gray-500 focus:outline-none"
          />
        </div>
        {/* 돋보기 아이콘 */}
        <div
          onClick={search}
          className="ml-3 p-3 cursor-pointer bg-gray-100 rounded-full shadow-sm"
        >
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="2em"
            width="2em"
            style={{
              transformOrigin: "center",
              transition: "transform 0.5s ease-in-out",
              transform: isSearchAnimation
                ? "scale(1.5) rotate(360deg)"
                : "scale(1) rotate(0deg)",
            }}
          >
            <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
          </svg>
        </div>

        {/* 인포 아이콘 */}
        <div
          onClick={handleInfoClick}
          className="ml-3 p-3 cursor-pointer bg-gray-100 rounded-full shadow-sm"
        >
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="2em"
            width="2em"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
            <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" />
          </svg>
        </div>
      </div>
      <style>
        {`@keyframes rotation {
    0% {
      background-position-x: 0;
    }
    100% {
      background-position-x: 1000px;
    }
  }
  .animate-rotation {
    animation: rotation 2s linear infinite;
  }

`}
      </style>
    </>
  );
}

export default SearchBar;
