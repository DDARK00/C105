import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useProjectStore from "../../store/useProjectStore";
import { fetchProjectDetail } from "../../api/axios";
import { Helmet } from "react-helmet-async";

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const param = useParams();

  // ProjectStore에서 필요한 정보 가져오기
  const { setProjectInfo, mainIdea } = useProjectStore();

  // 프로젝트 정보 가져오기
  useEffect(() => {
    const fetchProjectInfo = async () => {
      const projectDetail = await fetchProjectDetail(param.id);
      console.log(projectDetail);
      setProjectInfo(projectDetail);
    };

    if (param?.id) {
      fetchProjectInfo();
    }
  }, [param?.id, setProjectInfo]);

  const goHome = () => {
    // 프로젝트 리스트로 이동
    navigate("/");
  };

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

  useEffect(() => {
    const paths = [
      { path: null, item: "기본 정보", setOpen: null },
      { path: "mindmap", item: "마인드 맵", setOpen: setBrainstormingOpen },
      {
        path: "ideaboard",
        item: "아이디어 보드",
        setOpen: setBrainstormingOpen,
      },
      { path: "proposal", item: "기획서", setOpen: setResultOpen },
      {
        path: "requirementsspecification",
        item: "요구사항 명세서",
        setOpen: setResultOpen,
      },
      { path: "apispecification", item: "API 명세서", setOpen: setResultOpen },
      { path: "erd", item: "ERD", setOpen: setResultOpen },
      { path: "flowchart", item: "FLOWCHART", setOpen: setResultOpen },
    ];

    const lastPath = location.pathname.split("/")[3] ?? null;
    const matchedPath = paths.find(
      (p) => lastPath === p.path || location.pathname.includes(p.path)
    );

    if (matchedPath) {
      setActiveItem(matchedPath.item);
      if (matchedPath.setOpen) matchedPath.setOpen(true);
    }
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/fonts-archive/NEXONLv1Gothic/NEXONLv1Gothic.css"
          type="text/css"
        />
      </Helmet>
      <div className="fixed w-64 min-h-screen font-nexon   bg-slate-300 text-slate-950 p-4 flex flex-col justify-between rounded-tr-[20px] overflow-hidden shadow-lg">
        {/* Decorative background patterns */}
        <div className="absolute inset-0 z-0">
          {/* Subtle geometric pattern */}
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-[0.05]"
          >
            <pattern
              id="grid"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 20h40M20 0v40"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <circle cx="20" cy="20" r="1" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Subtle accent shapes */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-rose-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20" />
          <div className="absolute bottom-20 left-0 w-32 h-32 bg-sky-50 rounded-full -translate-x-1/2 opacity-20" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-row justify-between mb-3">
            <img
              src="/logo.png"
              alt="로고"
              onClick={goHome}
              className="cursor-pointer w-8 h-8"
            />
            <h1 className="text-base font-bold mb-4 select-none text-slate-700">
              GOOD IDEA
            </h1>
          </div>

          <nav>
            <ul className="space-y-4">
              {/* 기본 정보 */}
              <li>
                <Link
                  to={`project/${param?.id}`}
                  className={`text-xl block w-full h-full backdrop-blur-lg border-slate-200 p-2 my-2 border shadow-md rounded-lg transition-all duration-500 select-none ${
                    activeItem === "기본 정보"
                      ? "font-semibold cursor-default shadow-inner bg-[#bfdbfe] text-[#00008b]"
                      : "cursor-pointer bg-slate-100 hover:bg-[#bfdbfe]"
                  }`}
                  onClick={() => handleItemClick("기본 정보")}
                >
                  기본 정보
                </Link>
              </li>

              {/* 브레인 스토밍 메뉴 */}
              <li>
                <div
                  className={`text-xl flex justify-between items-center cursor-pointer border shadow-md backdrop-blur-md select-none p-2 mt-2 rounded-lg transition-all duration-500 ${
                    isBrainstormingOpen
                      ? "bg-[#bfdbfe] border-slate-300  font-semibold shadow-inner text-[#00008b]"
                      : "bg-slate-100 hover:bg-[#bfdbfe]"
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
                    className={`ml-2 transition-transform duration-500 ${
                      isBrainstormingOpen ? "rotate-[540deg]" : ""
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.3251 18.3025C15.9736 18.6107 15.497 18.7838 15.0001 18.7838C14.5032 18.7838 14.0267 18.6107 13.6751 18.3025L6.60262 12.096C6.25104 11.7872 6.05359 11.3685 6.05371 10.9319C6.05383 10.4953 6.2515 10.0766 6.60324 9.768C6.95499 9.45936 7.43199 9.28603 7.92931 9.28613C8.42664 9.28624 8.90354 9.45977 9.25512 9.76855L15.0001 14.8119L20.7451 9.76855C21.0986 9.46857 21.5721 9.30246 22.0638 9.30601C22.5554 9.30955 23.0257 9.48247 23.3736 9.7875C23.7214 10.0925 23.9188 10.5053 23.9233 10.9369C23.9278 11.3684 23.739 11.7843 23.3976 12.0949L16.3264 18.3036L16.3251 18.3025Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <ul
                  className={`transition-all duration-500 overflow-hidden ${
                    isBrainstormingOpen
                      ? "max-h-40 opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <li>
                    <Link
                      to={`/project/${param?.id}/mindmap`}
                      className={`block w-full  text-lg p-1 my-2 pl-6 select-none rounded-lg transition-all duration-300 hover:bg-slate-100 ${
                        activeItem === "마인드 맵"
                          ? "bg-slate-100 cursor-default"
                          : "cursor-pointer "
                      }`}
                      onClick={() => handleItemClick("마인드 맵")}
                    >
                      마인드 맵
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/project/${param?.id}/ideaboard`}
                      className={`block w-full text-lg p-1 my-2 pl-6 select-none rounded-lg transition-all duration-300 hover:bg-slate-100 ${
                        activeItem === "아이디어 보드"
                          ? "bg-slate-100 cursor-default"
                          : "cursor-pointer "
                      }`}
                      onClick={() => handleItemClick("아이디어 보드")}
                    >
                      아이디어 보드
                    </Link>
                  </li>
                </ul>
              </li>

              {/* 산출물 메뉴 */}
              {mainIdea?.ideaId && (
                <li>
                  <div
                    className={`backdrop-blur-lg  text-xl flex flex-row justify-between items-center cursor-pointer border border-slate-200 shadow-md p-2 select-none rounded-lg transition-all duration-500 ${
                      isResultOpen
                        ? "font-semibold border-slate-300 shadow-inner bg-[#bfdbfe] text-[#00008b]"
                        : "bg-slate-100 hover:bg-[#bfdbfe]"
                    }`}
                    onClick={toggleResult}
                  >
                    채택 아이디어
                    <svg
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`ml-2 transition-transform duration-500 ${
                        isResultOpen ? "rotate-[540deg]" : ""
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.3251 18.3025C15.9736 18.6107 15.497 18.7838 15.0001 18.7838C14.5032 18.7838 14.0267 18.6107 13.6751 18.3025L6.60262 12.096C6.25104 11.7872 6.05359 11.3685 6.05371 10.9319C6.05383 10.4953 6.2515 10.0766 6.60324 9.768C6.95499 9.45936 7.43199 9.28603 7.92931 9.28613C8.42664 9.28624 8.90354 9.45977 9.25512 9.76855L15.0001 14.8119L20.7451 9.76855C21.0986 9.46857 21.5721 9.30246 22.0638 9.30601C22.5554 9.30955 23.0257 9.48247 23.3736 9.7875C23.7214 10.0925 23.9188 10.5053 23.9233 10.9369C23.9278 11.3684 23.739 11.7843 23.3976 12.0949L16.3264 18.3036L16.3251 18.3025Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <ul
                    className={`transition-all duration-500 overflow-hidden ${
                      isResultOpen
                        ? "max-h-60 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {[
                      { name: "기획서", path: "proposal" },
                      {
                        name: "요구사항 명세서",
                        path: "requirementsspecification",
                      },
                      { name: "API 명세서", path: "apispecification" },
                      { name: "ERD", path: "erd" },
                      { name: "FLOWCHART", path: "flowchart" },
                    ].map((item) => (
                      <li key={item.path}>
                        <Link
                          to={`/project/${param?.id}/idea/${mainIdea?.ideaId}/${item.path}`}
                          className={`block w-full text-lg p-1 my-2 pl-6 select-none rounded-lg  hover:bg-slate-100 transition-all duration-500 ${
                            activeItem === item.name
                              ? "bg-slate-100 cursor-default "
                              : "cursor-pointer "
                          }`}
                          onClick={() => handleItemClick(item.name)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </nav>
        </div>
        <footer className="text-sm text-slate-900 relative z-10">
          ©SSAFY 11TH C105
        </footer>
      </div>
      <style>
        {`
        .font-nexon {
  @apply font-sans; /* Tailwind의 기본 sans-serif 설정을 적용 */
  font-family: 'NEXON Lv1 Gothic', sans-serif;
}
`}
      </style>
    </>
  );
}

export default Nav;
