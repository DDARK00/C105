import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import DefaultButton from "../components/common/DefaultButton";
import { useUserStore } from "../store/useUserStore";
import MainPhaseContent from "../components/main/MainPhaseContent";
import { fetchUserInfo } from "../api/axios";

function MainPage() {
  const [activeSection, setActiveSection] = useState("section1");
  const [isLastSection, setIsLastSection] = useState(false);
  const { setLogin } = useUserStore();
  const navigate = useNavigate();
  const handleGitLabLogin = () => {
    window.location.href = import.meta.env.VITE_REDIRECT_URI;
  };

  // 테스트 드라이버용 함수 ----------------- 시작 -----------------
  const handleDevLoginForJUHO = async () => {
    localStorage.setItem("accessToken", import.meta.env.VITE_JUHO_ACCESSTOKEN);
    localStorage.setItem(
      "refreshToken",
      import.meta.env.VITE_JUHO_REFRESHTOKEN
    );
    // 프로필 정보 요청
    const profileResponse = await fetchUserInfo();
    setLogin(profileResponse); // userInfo 저장
    console.log(profileResponse);
    // 프로젝트 리스트 페이지로 리디렉트
    navigate("/projectlist");
  };
  // 테스트 드라이버용 함수 ----------------- 끝 -----------------
  const sections = useMemo(
    () => [
      {
        id: "section1",
        counter: "01",
        title: "올인원 기획/설계 플랫폼",
        body: (
          <>
            이곳에서{" "}
            <span className="text-blue-300 font-extrabold "> 싸피인</span>을
            위한 최적의{" "}
            <span className="text-yellow-300 font-extrabold">기획</span>과{" "}
            <span className="text-red-300 font-extrabold">설계</span>를
            경험해보세요.
          </>
        ),
        bgColor: "bg-gray-900",
        textBgColor: "bg-red-900",
      },
      {
        id: "section2",
        counter: "02",
        title: "마인드맵 및 기획 TOOL",
        body: (
          <>
            <span className="text-emerald-300 font-extrabold">마인드맵</span>과
            이전 기수의{" "}
            <span className="text-yellow-300 font-extrabold">레퍼런스</span>를
            통해 창의적인 아이디어를 쉽게 도출할 수 있습니다. 다양한 기획 도구를
            경험해보세요.
          </>
        ),
        bgColor: "bg-red-500",
        textBgColor: "bg-gray-500",
      },
      {
        id: "section3",
        counter: "03",
        title: "AI 기획서 초안 서비스",
        body: (
          <>
            <span className="text-yellow-300 font-extrabold">AI</span>가
            자동으로 기획서 초안을 작성해줍니다. 아이디어가 떠오르지 않을 때{" "}
            <span className="text-yellow-300 font-extrabold">AI</span>의 도움을
            받아보세요.
            <span className="text-red-600 font-extrabold">빠르고</span>{" "}
            <span className="text-blue-700 font-extrabold">간편</span>하게
            기획을 시작할 수 있습니다.
          </>
        ),
        bgColor: "bg-orange-500",
        textBgColor: "bg-emerald-500",
      },
      {
        id: "section4",
        counter: "04",
        title: "설계 TOOL + 공동 편집",
        body: (
          <>
            <span className="text-amber-400 font-extrabold">
              요구사항 명세서
            </span>
            , <span className="text-sky-200 font-extrabold">API 명세서</span>,
            <span className="text-blue-600 font-extrabold">FLOW CHART</span>,{" "}
            <span className="text-amber-800 font-extrabold">ERD</span> 등 다양한
            산출물을 작성할 수 있습니다.{" "}
            <span className="text-red-600 font-extrabold">CRDT</span> 기반으로{" "}
            <span className="text-emerald-800 font-extrabold">공동 편집</span>과
            <span className="text-emerald-800 font-extrabold">커서 공유</span>를
            통해 팀원들과{" "}
            <span className="text-red-600 font-extrabold">실시간 작업</span>을
            할 수 있습니다.
          </>
        ),
        bgColor: "bg-purple-500",
        textBgColor: "bg-[#f0bf93]",
      },
      {
        id: "section5",
        counter: "05",
        title: "AI Chat Bot Service",
        body: (
          <>
            "궁금한 점이 있다면,{" "}
            <span className="text-amber-400 font-extrabold">GPT 챗봇</span>을
            사용해{" "}
            <span className="text-emerald-600 font-extrabold">무엇이든</span>{" "}
            물어보세요!!"
          </>
        ),
        bgColor: "bg-blue-500",
        textBgColor: "bg-red-500",
      },
      {
        id: "section6",
        counter: "06",
        title: "GitLab 연동",
        body: (
          <>
            <span className="text-blue-600 font-extrabold">SSAFY</span>{" "}
            <span className="text-orange-600 font-extrabold">GitLab</span>과
            연동하여 프로젝트 정보를 손쉽게 가져오세요.{" "}
            <span className="text-orange-600 font-extrabold">GitLab</span>
            계정으로 로그인하고 간편하게 프로젝트를 시작해보세요.
          </>
        ),
        bgColor: "bg-emerald-500",
        textBgColor: "bg-gray-800",
      },
    ],
    []
  );
  const fixedPositions = [
    { top: "5%", left: "10%" },
    { top: "5%", left: "50%" },
    { top: "5%", left: "70%" },
    { top: "20%", left: "15%" },
    { top: "20%", left: "35%" },
    { top: "20%", left: "55%" },
    { top: "20%", left: "75%" },
    { top: "20%", left: "95%" },
    { top: "35%", left: "10%" },
    { top: "35%", left: "70%" },
    { top: "65%", left: "10%" },
    { top: "65%", left: "30%" },
    { top: "65%", left: "50%" },
    { top: "80%", left: "15%" },
    { top: "80%", left: "55%" },
    { top: "80%", left: "75%" },
    { top: "10%", left: "5%" },
    { top: "40%", left: "85%" },
    { top: "80%", left: "85%" },
    { top: "65%", left: "74%" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      const lastSection = document.getElementById("section6");
      const { top } = lastSection.getBoundingClientRect();
      setIsLastSection(top <= windowHeight / 2); // 마지막 섹션에 도달하면 true 설정

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top <= windowHeight / 2 && top > -windowHeight / 2) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const PostitNote = ({ children }) => (
    <div className="relative group">
      {/* Tape effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-white/40 rounded-sm transform -rotate-2" />
      <div className="relative transform transition-transform duration-300 ease-out hover:-rotate-1 hover:translate-y-1">
        {/* Main Post-it Note */}
        <div
          className="bg-yellow-300 p-8 rounded-sm relative z-50
             before:absolute before:inset-0 before:bg-gradient-to-b 
             before:from-white/5 before:to-transparent before:rounded-sm"
        >
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: "multiply",
            }}
          />

          {/* Content container */}
          <div className="relative z-70">{children}</div>
        </div>

        {/* Enhanced shadow layers */}
        <div className="absolute inset-0 bg-black/20 rounded-sm blur-sm -z-10 transform translate-y-2 translate-x-2" />
        <div className="absolute inset-0 bg-black/15 rounded-sm blur-md -z-20 transform translate-y-3 translate-x-3" />
        <div className="absolute inset-0 bg-black/10 rounded-sm blur-lg -z-30 transform translate-y-4 translate-x-4" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>메인페이지</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/fonts-archive/Maplestory/Maplestory.css"
          type="text/css"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>

      <div className="min-h-screen font-serif relative overflow-x-hidden font-Maplestory main-page select-none">
        {/* 고정된 GitLab 로그인 버튼: 마지막 섹션에서 안 보이게 */}
        {!isLastSection && (
          <div className="fixed top-8 right-8 z-[51] flex flex-col items-center animate-tinUpIn">
            <DefaultButton
              onClick={handleGitLabLogin}
              theme="bright"
              className="bg-slate-500 hover:bg-slate-300 mt-3 "
              text="GitLab으로 로그인"
            />
          </div>
        )}

        <nav className="fixed h-full p-8 flex flex-col justify-end z-50">
          <ul className="mb-24 ml-8">
            {sections.map((section) => (
              <li
                key={section.id}
                className={`relative mb-4 transition-all duration-300 ${
                  activeSection === section.id ? "pl-4 pointer-events-none" : ""
                }`}
              >
                <div
                  className={`absolute left-[-30px] top-[15px] w-5 h-[250px] border-l-2 border-t-2 border-white
                    ${
                      activeSection === section.id
                        ? "w-8 h-[400px] top-[35px]"
                        : ""
                    }`}
                />
                <button
                  onClick={() => scrollToSection(section.id)}
                  className="text-white transition-all duration-150 hover:pl-4 block w-full text-left"
                >
                  <span
                    className={`transition-all duration-150
                    ${activeSection === section.id ? "text-5xl" : "text-xl"}`}
                  >
                    {section.counter}
                  </span>

                  <div
                    className={`overflow-hidden transition-all duration-300 bg-opacity-70 rounded-lg border-0  ${
                      section.textBgColor
                    } ${
                      activeSection === section.id
                        ? "max-h-60 mt-2 opacity-100 p-5 "
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <h3 className="text-3xl font-light w-[300px] mb-2">
                      {section.title}
                    </h3>
                    <p className="text-md font-thin w-[300px] b-span">
                      {section.body}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={`h-screen text-4xl font-thin ${section.bgColor} text-white
              flex flex-col justify-center items-center gap-8 relative`}
          >
            <img
              src="/bonobono.webp"
              alt="bonobono"
              className="absolute "
              style={{
                top: "81%",
                left: "75.5%",
                width: "100px",
                height: "100px",
              }}
            />
            {/* 배경 포스트잇 추가 */}
            {fixedPositions.map((position, index) => (
              <div
                key={index}
                className="absolute rounded-lg transform shadow-lg "
                style={{
                  width: "115px",
                  height: "115px",
                  top: position.top,
                  left: position.left,
                  transform: `rotate(${Math.random() * 20 - 10}deg)`,
                  opacity: 0.7,
                  backgroundColor: [
                    "#ffd54f",
                    "#ff8a65",
                    "#a5d6a7",
                    "#90caf9",
                    "#f48fb1",
                  ][index % 5],
                }}
              />
            ))}

            <PostitNote>
              {section.id === "section1" && (
                <>
                  <MainPhaseContent
                    phrases={[
                      "기획.. 많이 어렵죠??!!!",
                      "GOOD IDEA에서 쉽게 시작하세요 !!",
                    ]}
                  />
                  <p className="text-2xl font-bold mt-8 text-gray-800">
                    Welcome to Our Platform
                  </p>
                  <p className="text-xl text-gray-700">
                    아래로 스크롤하거나 네비게이션을 사용해보세요.
                  </p>
                </>
              )}
              {section.id === "section2" && (
                <>
                  <MainPhaseContent
                    phrases={["CHAT GPT 챗봇", "무엇이든 물어보삼 !!"]}
                  />
                </>
              )}
              {section.id === "section3" && (
                <>
                  <MainPhaseContent
                    phrases={[
                      "마인드맵 및 기획 도구",
                      "GOOD IDEA에서 한 번에 !!",
                    ]}
                  />
                </>
              )}
              {section.id === "section4" && (
                <>
                  <MainPhaseContent
                    phrases={[
                      "AI기반 기획서 작성",
                      "손쉽게 기획서 작성 가능 !!",
                    ]}
                  />
                </>
              )}
              {section.id === "section5" && (
                <>
                  <MainPhaseContent
                    phrases={[
                      "기획 산출물 작성 및 공동 편집",
                      "노션보다 쉽다 !!",
                    ]}
                  />
                </>
              )}
              {section.id === "section6" && (
                <div className="flex flex-col">
                  <MainPhaseContent
                    phrases={[
                      "GitLab 연동으로 간편한 시작 !",
                      "회원가입? 필요 없다 !!",
                    ]}
                  />
                  <DefaultButton
                    onClick={handleGitLabLogin}
                    theme="bright"
                    className="bg-slate-500 hover:bg-slate-300 mt-3"
                    text="GitLab으로 로그인"
                  />

                  {/* 테스트 드라이버용 버튼 ------------------- 시작 ------------------- */}
                  {import.meta.env.VITE_APP_MODE === "DEV" && (
                    <DefaultButton
                      onClick={handleDevLoginForJUHO}
                      theme="bright"
                      className="bg-slate-500 hover:bg-slate-300 mt-3"
                      text="주호 계정으로 로그인하기"
                    />
                  )}
                  {/* 테스트 드라이버용 버튼 ------------------- 끝 ------------------- */}
                </div>
              )}
            </PostitNote>
          </section>
        ))}
      </div>

      <style>
        {`
        *{
        font-family: 'Maplestory', sans-serif;
        }
        
::-webkit-scrollbar {
  background-color: #000; /* WebKit 브라우저에서만 적용 */
  width: 12px;
  border-radius:0px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
        ::-webkit-scrollbar-thumb {
        border-radius:0px;
  background-image: linear-gradient(
    to top, 
    #ff5722, 
    #a520ca 50%,
    #2681cc
  );
}


`}
      </style>
    </>
  );
}

export default MainPage;
