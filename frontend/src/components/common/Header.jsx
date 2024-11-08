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

      <DefaultButton
        onClick={() => {
          // 로그아웃 로직
          clearAuthAxiosInstance();
          setLogout();
          navigate("/");
        }}
        theme="bright"
        className="hover:bg-blue-700 py-2 px-4 rounded m-0 text-sm"
        text={
          <div className="flex items-center">
            {userInfo.username}
            {/* logout */}
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
  );
}

export default Header;
