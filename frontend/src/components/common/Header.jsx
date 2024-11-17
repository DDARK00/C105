import { useNavigate, useParams } from "react-router-dom";
import DefaultButton from "./DefaultButton";
import { useUserStore } from "../../store/useUserStore";
import { clearAuthAxiosInstance } from "../../api/http-commons/authAxios";
import { useEffect, useState } from "react";
import { useProjectListStore } from "../../store/useProjectListStore";

function Header() {
  const navigate = useNavigate();
  const param = useParams();
  const [content, setContent] = useState(null);
  const { projects } = useProjectListStore();

  useEffect(() => {
    if (param?.id) {
      projects.map((project) => {
        if (project.project_id === parseInt(param.id)) {
          setContent(project.projectType);
        }
      });
    } else {
      setContent(null);
    }
  }, [param, projects]);

  const goProjectList = () => {
    // 프로젝트 리스트로 이동
    navigate("/projectlist");
  };
  const { userInfo, setLogout } = useUserStore();

  return (
    <div className="border-b-2 border-gray-300 flex items-center justify-between p-2">
      <div className="flex items-center">
        <div className="text-xl">
          <span
            onClick={goProjectList}
            className={`cursor-pointer ${content ? "" : "font-bold"}`}
          >
            프로젝트 목록
          </span>
          {content && (
            <>
              {" / "}
              <span className="font-bold">{content} 프로젝트</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="font-semibold text-lg text-gray-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 18.364A3 3 0 018.535 21h6.93a3 3 0 013.414-2.636l1.086 1.086a1 1 0 001.414-1.414l-1.086-1.086a3 3 0 01-4.242-4.242l1.086-1.086a1 1 0 00-1.414-1.414l-1.086 1.086a3 3 0 01-4.242 0l-1.086-1.086a1 1 0 00-1.414 1.414l1.086 1.086A3 3 0 015.121 18.364z"
            />
          </svg>
          {userInfo.username}
        </div>

        {/* 로그아웃 버튼 */}
        <DefaultButton
          onClick={() => {
            // 로그아웃 로직
            clearAuthAxiosInstance();
            setLogout();
            navigate("/");
          }}
          theme="none"
          className="pl-1 border pr-2 py-2 border-red-500 text-red-500 rounded-full shadow hover:bg-red-500 hover:text-white m-0 text-sm"
          text={
            <div title="로그아웃" className="flex items-center">
              <svg
                fill="none"
                viewBox="0 0 15 15"
                height="1em"
                width="1em"
                className="ml-2"
              >
                <path
                  stroke="currentColor"
                  d="M13.5 7.5l-3 3.25m3-3.25l-3-3m3 3H4m4 6H1.5v-12H8"
                />
              </svg>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Header;
