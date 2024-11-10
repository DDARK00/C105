import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useProjectStore from "../../store/useProjectStore";
import authAxiosInstance from "../../api/http-commons/authAxios";

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const param = useParams();
  // ProjectStore에서 필요한 정보 가져오기
  const { setProjectInfo, mainIdea, hasMainIdea } = useProjectStore();

  // 프로젝트 정보 가져오기
  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        const response = await authAxiosInstance.get(
          `/api/v1/project/${param?.id}`
        );
        setProjectInfo(response.data.data);
      } catch (error) {
        console.error("프로젝트 정보 조회 실패:", error);
      }
    };

    if (param?.id) {
      fetchProjectInfo();
    }
  }, [param?.id, setProjectInfo]);
  // useEffect(() => {
  //   console.log(param?.id);
  //   if (param?.id) {
  //     console.log("프로젝트 리스트", projects);
  //     projects.map((project) => {
  //       console.log("반복문", project.project_id);
  //       if (project.project_id === parseInt(param.id)) {
  //         setContent(project.projectType);
  //       }
  //     });
  //   } else {
  //     setContent(null);
  //   }
  // }, [param]);

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

    const lastPath = location.pathname.split("/")[2] ?? null;

    const matchedPath = paths.find(
      (p) => lastPath === p.path || location.pathname.includes(p.path)
    );

    if (matchedPath) {
      setActiveItem(matchedPath.item);
      if (matchedPath.setOpen) matchedPath.setOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="fixed w-64 min-h-screen bg-gradient-to-b from-[#999999] to-[#333333] text-white p-4 flex flex-col justify-between rounded-tr-[20px]">
      <div>
        <div className="flex flex-row justify-between mb-3">
          <img
            src="/logo.png"
            alt="로고"
            onClick={goHome}
            className="cursor-pointer w-8 h-8"
          />
          <h1 className="text-base font-bold mb-4 select-none">GOOD IDEA</h1>
        </div>
        <nav>
          <ul className="space-y-4">
            {/* 기본 정보 */}
            <li>
              <Link
                to={`project/${param?.id}`}
                className={`text-xl block w-full h-full p-2 border border-[#8F8F8F] shadow-md rounded-lg hover:bg-[#666666] select-none ${
                  activeItem === "기본 정보"
                    ? "bg-[#666666] cursor-default font-bold"
                    : "cursor-pointer"
                }`}
                onClick={() => handleItemClick("기본 정보")}
              >
                기본 정보
              </Link>
            </li>

            {/* 브레인 스토밍 메뉴 */}
            <li>
              <div
                className={`text-xl flex justify-between items-center cursor-pointer border border-[#8F8F8F] shadow-md select-none p-2 rounded-lg ${
                  isBrainstormingOpen ? "font-bold" : ""
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
                    fill="white"
                  />
                </svg>
              </div>

              {/* 브레인 스토밍 드롭다운 */}
              <ul
                className={`m-0 transition-all duration-500 overflow-hidden ${
                  isBrainstormingOpen
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <li className="mt-5">
                  <Link
                    to={`/project/${param?.id}/mindmap`}
                    className={`block w-full h-full text-lg mb-1 p-1 pl-6 select-none rounded-lg hover:bg-[#666666] ${
                      activeItem === "마인드 맵"
                        ? "bg-[#666666] cursor-default"
                        : "cursor-pointer"
                    }`}
                    onClick={() => handleItemClick("마인드 맵")}
                  >
                    마인드 맵
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/project/${param?.id}/ideaboard`}
                    className={`block w-full h-full text-lg mb-1 p-1 pl-6 select-none rounded-lg hover:bg-[#666666] ${
                      activeItem === "아이디어 보드"
                        ? "bg-[#666666] cursor-default"
                        : "cursor-pointer"
                    }`}
                    onClick={() => handleItemClick("아이디어 보드")}
                  >
                    아이디어 보드
                  </Link>
                </li>
              </ul>
            </li>

            {/* 산출물 메뉴 */}
            {hasMainIdea() && (
              <li>
                <div
                  className={` text-xl flex flex-row justify-between items-center cursor-pointer border border-[#858585] shadow-md p-2 select-none rounded-lg ${
                    isResultOpen ? "font-bold" : ""
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
                      fill="white"
                    />
                  </svg>
                </div>

                {/* 산출물 드롭다운 */}
                <ul
                  className={`transition-all duration-500 overflow-hidden ${
                    isResultOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <li className="mt-5">
                    <Link
                      to={`/project/${param?.id}/idea/${mainIdea}/proposal`}
                      className={`block w-full h-full text-lg mb-1 p-1 pl-6 select-none rounded-lg hover:bg-[#666666] ${
                        activeItem === "기획서"
                          ? "bg-[#666666] cursor-default"
                          : "cursor-pointer"
                      }`}
                      onClick={(e) => {
                        if (!mainIdea?.id) {
                          e.preventDefault();
                          return;
                        }
                        handleItemClick("기획서");
                      }}
                    >
                      기획서
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/project/${param?.id}/idea/${mainIdea}/requirementsspecification`}
                      className={`block w-full h-fullx text-lg mb-1 p-1 pl-6 select-none rounded-lg hover:bg-[#666666] ${
                        activeItem === "요구사항 명세서"
                          ? "bg-[#666666] cursor-default"
                          : "cursor-pointer"
                      }`}
                      onClick={() => handleItemClick("요구사항 명세서")}
                    >
                      요구사항 명세서
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/project/${param?.id}/idea/${mainIdea}/apispecification`}
                      className={`block w-full h-full text-lg mb-1 p-1 pl-6 select-none rounded-lg hover:bg-[#666666] ${
                        activeItem === "API 명세서"
                          ? "bg-[#666666] cursor-default"
                          : "cursor-pointer"
                      }`}
                      onClick={() => handleItemClick("API 명세서")}
                    >
                      API 명세서
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/project/${param?.id}/idea/${mainIdea}/erd`}
                      className={`block w-full h-full text-lg mb-1 p-1 pl-6 select-none rounded-lg hover:bg-[#666666] ${
                        activeItem === "ERD"
                          ? "bg-[#666666] cursor-default"
                          : "cursor-pointer"
                      }`}
                      onClick={() => handleItemClick("ERD")}
                    >
                      ERD
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/project/${param?.id}/idea/${mainIdea}/flowchart`}
                      className={`block w-full h-full text-lg mb-1 p-1 pl-6 select-none rounded-lg hover:bg-[#666666] ${
                        activeItem === "FLOWCHART"
                          ? "bg-[#666666] cursor-default"
                          : "cursor-pointer"
                      }`}
                      onClick={() => handleItemClick("FLOWCHART")}
                    >
                      FLOWCHART
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <footer className="text-sm">©SSAFY 11TH C105</footer>
    </div>
  );
}

export default Nav;
