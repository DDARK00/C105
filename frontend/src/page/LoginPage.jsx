import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { fetchUserInfo } from "../api/axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const setLogin = useUserStore((state) => state.setLogin);

  useEffect(() => {
    const handleLogin = async () => {
      // URL에서 토큰 추출
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const refreshToken = urlParams.get("refreshToken");
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 프로필 정보 요청
        const profileResponse = await fetchUserInfo();
        console.log(profileResponse);
        setLogin(profileResponse); // userInfo 저장

        // 프로젝트 리스트 페이지로 리디렉트
        navigate("/projectlist");
      } else {
        console.log("리디렉트된 URL에 토큰이 없습니다.");
      }
    };
    handleLogin();
  }, [navigate, setLogin]);

  return <>Login Page</>;
};

export default LoginPage;
