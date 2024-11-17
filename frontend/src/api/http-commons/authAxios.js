import axios from "axios";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = "https://goodidea.world/";
const REFRESH_URL = BASE_URL + "/main/jwt/refresh";

const authAxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
authAxiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
authAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        authAxiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        return authAxiosInstance(originalRequest); // 원래의 요청을 새로운 토큰으로 재전송
      } catch (refreshError) {
        // 리프레시 토큰 실패 처리
        console.error("Failed to refresh token:", refreshError);
        // 로그아웃 처리나 리다이렉트 등 추가적인 처리를 여기에 구현
        // clearAuthData();
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 로그아웃 또는 필요 시 인스턴스 제거
export const clearAuthAxiosInstance = () => {
  clearAuthData();
};

// 토큰 재발행 함수
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      REFRESH_URL,
      {},
      {
        headers: {
          // "Refresh-Token": `Bearer ${refreshToken}`,
          // api 명세에 맞게 수정
        },
      }
    );
    const { accessToken } = response.data;

    if (accessToken) {
      // 새로운 토큰 로컬 스토리지에 저장
      localStorage.setItem("accessToken", accessToken);
    }

    return accessToken;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error; // 에러를 던져서 응답 인터셉터가 처리할 수 있도록 합니다.
  }
};

// 로그인 상태 초기화
const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userStore");
};

export default authAxiosInstance;
