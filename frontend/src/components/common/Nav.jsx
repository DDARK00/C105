import { Link } from "react-router-dom";
import { useState } from "react";

function Nav() {
  // 브레인 스토밍 드롭다운의 열림/닫힘 상태를 관리하는 state
  const [isBrainstormingOpen, setBrainstormingOpen] = useState(false);

  // 산출물 드롭다운의 열림/닫힘 상태를 관리하는 state
  const [isResultOpen, setResultOpen] = useState(false);

  // 선택된 메뉴
  const [activeItem, setActiveItem] = useState(null);

  // 브레인 스토밍 드롭다운 열림/닫힘 상태를 토글하는 함수
  const toggleBrainstorming = () => {
    setBrainstormingOpen((prev) => !prev);
  };

  // 산출물 드롭다운 열림/닫힘 상태를 토글하는 함수
  const toggleResult = () => {
    setResultOpen((prev) => !prev);
  };

  // 선택된 메뉴 세팅
  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-grayCustom-100 via-grayCustom-200 via-grayCustom-300 to-grayCustom-400 text-white p-4 flex flex-col justify-between rounded-tr-[20px]">
      <div>
        <div className="flex flex-row justify-between mb-3">
          <img src="" alt="로고" />
          <h1 className="text-base font-bold mb-4 select-none">GOOD IDEA</h1>
        </div>
        <nav>
          <ul className="space-y-4">
            {/* 기본 정보 */}
            <li
              className={`block text-2xl cursor-pointer border border-[#8F8F8F] shadow-md p-2 select-none rounded-lg hover:bg-[#666666] ${
                activeItem === "기본 정보" ? "bg-[#666666]" : ""
              }`}
              onClick={() => handleItemClick("기본 정보")}
            >
              <Link to="projectdetail/:id">기본 정보</Link>
            </li>

            {/* 브레인 스토밍 메뉴 */}
            <li
              className={`flex flex-row justify-between items-center text-2xl cursor-pointer border border-[#8F8F8F] shadow-md p-2 select-none rounded-lg hover:bg-[#666666] ${
                isBrainstormingOpen ? "bg-[#666666]" : ""
              }`}
              onClick={toggleBrainstorming}
            >
              브레인 스토밍
              <svg
                width="29"
                height="28"
                viewBox="0 0 29 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-2 transition-transform duration-300 ${
                  isBrainstormingOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.3251 18.3025C15.9736 18.6107 15.497 18.7838 15.0001 18.7838C14.5032 18.7838 14.0267 18.6107 13.6751 18.3025L6.60262 12.096C6.25104 11.7872 6.05359 11.3685 6.05371 10.9319C6.05383 10.4953 6.2515 10.0766 6.60324 9.768C6.95499 9.45936 7.43199 9.28603 7.92931 9.28613C8.42664 9.28624 8.90354 9.45977 9.25512 9.76855L15.0001 14.8119L20.7451 9.76855C21.0986 9.46857 21.5721 9.30246 22.0638 9.30601C22.5554 9.30955 23.0257 9.48247 23.3736 9.7875C23.7214 10.0925 23.9188 10.5053 23.9233 10.9369C23.9278 11.3684 23.739 11.7843 23.3976 12.0949L16.3264 18.3036L16.3251 18.3025Z"
                  fill="white"
                />
              </svg>
            </li>

            {/* 브레인 스토밍 드롭다운 */}
            <ul
              className={`transition-all duration-500 overflow-hidden ${
                isBrainstormingOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              <li
                className={`text-lg mb-1 p-1 pl-4 cursor-pointer select-none rounded-lg hover:bg-[#666666] ${
                  activeItem === "마인드 맵" ? "bg-[#666666]" : ""
                }`}
                onClick={() => handleItemClick("마인드 맵")}
              >
                <Link to="/projectdetail/:id/mindmap">마인드 맵</Link>
              </li>
              <li
                className={`text-lg mb-1 p-1 pl-4 cursor-pointer select-none rounded-lg hover:bg-[#666666] ${
                  activeItem === "아이디어 보드" ? "bg-[#666666]" : ""
                }`}
                onClick={() => handleItemClick("아이디어 보드")}
              >
                <Link to="/projectdetail/:id/ideaboard">아이디어 보드</Link>
              </li>
            </ul>

            {/* 산출물 메뉴 */}
            <li
              className={`flex flex-row justify-between items-center text-2xl cursor-pointer border border-[#858585] shadow-md p-2 select-none rounded-lg hover:bg-[#666666] ${
                isResultOpen ? "bg-[#666666]" : ""
              }`}
              onClick={toggleResult}
            >
              산출물
              <svg
                width="29"
                height="28"
                viewBox="0 0 29 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-2 transition-transform duration-300 ${
                  isResultOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.3251 18.3025C15.9736 18.6107 15.497 18.7838 15.0001 18.7838C14.5032 18.7838 14.0267 18.6107 13.6751 18.3025L6.60262 12.096C6.25104 11.7872 6.05359 11.3685 6.05371 10.9319C6.05383 10.4953 6.2515 10.0766 6.60324 9.768C6.95499 9.45936 7.43199 9.28603 7.92931 9.28613C8.42664 9.28624 8.90354 9.45977 9.25512 9.76855L15.0001 14.8119L20.7451 9.76855C21.0986 9.46857 21.5721 9.30246 22.0638 9.30601C22.5554 9.30955 23.0257 9.48247 23.3736 9.7875C23.7214 10.0925 23.9188 10.5053 23.9233 10.9369C23.9278 11.3684 23.739 11.7843 23.3976 12.0949L16.3264 18.3036L16.3251 18.3025Z"
                  fill="white"
                />
              </svg>
            </li>

            {/* 산출물 드롭다운 */}
            <ul
              className={`transition-all duration-500 overflow-hidden ${
                isResultOpen ? "max-h-60" : "max-h-0"
              }`}
            >
              <li
                className={`text-lg mb-1 p-1 pl-4 cursor-pointer select-none rounded-lg hover:bg-[#666666] ${
                  activeItem === "프로젝트 개요" ? "bg-[#666666]" : ""
                }`}
                onClick={() => handleItemClick("프로젝트 개요")}
              >
                <Link to="/projectdetail/:id/proposal">프로젝트 개요</Link>
              </li>
              <li
                className={`text-lg mb-1  p-1 pl-4 cursor-pointer select-none rounded-lg hover:bg-[#666666] ${
                  activeItem === "요구사항 명세서" ? "bg-[#666666]" : ""
                }`}
                onClick={() => handleItemClick("요구사항 명세서")}
              >
                <Link to="/projectdetail/:id/requirementsspecification">
                  요구사항 명세서
                </Link>
              </li>
              <li
                className={`text-lg mb-1 p-1 pl-4 cursor-pointer select-none rounded-lg hover:bg-[#666666] ${
                  activeItem === "API 명세서" ? "bg-[#666666]" : ""
                }`}
                onClick={() => handleItemClick("API 명세서")}
              >
                <Link to="/projectdetail/:id/apispecification">API 명세서</Link>
              </li>
              <li
                className={`text-lg mb-1 p-1 pl-4 cursor-pointer select-none rounded-lg hover:bg-[#666666] ${
                  activeItem === "ERD" ? "bg-[#666666]" : ""
                }`}
                onClick={() => handleItemClick("ERD")}
              >
                <Link to="/projectdetail/:id/erd">ERD</Link>
              </li>
              <li
                className={`text-lg mb-1  p-1 pl-4 cursor-pointer select-none rounded-lg hover:bg-[#666666] ${
                  activeItem === "FLOWCHART" ? "bg-[#666666]" : ""
                }`}
                onClick={() => handleItemClick("FLOWCHART")}
              >
                <Link to="/projectdetail/:id/flowchart">FLOWCHART</Link>
              </li>
            </ul>
          </ul>
        </nav>
      </div>
      <footer className="text-sm">©SSAFY 11TH C105</footer>
    </div>
  );
}

export default Nav;
