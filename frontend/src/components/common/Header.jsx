import { useNavigate } from "react-router-dom";
import DefaultButton from "./DefaultButton";
import { useUserStore } from "../../store/useUserStore";
import { clearAuthAxiosInstance } from "../../api/http-commons/authAxios";
import { useEffect } from "react";

function Header({ content }) {
  const navigate = useNavigate();
  const goProjectList = () => {
    // 프로젝트 리스트로 이동
    navigate("/projectlist");
  };
  const { userInfo, setLogout } = useUserStore();

  useEffect(() => {
    console.log("userInfo", userInfo);
  }, [userInfo]);

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
              <span className="font-bold">{content}</span>
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
