// src/api/guestAxios.ts
import axios from "axios";

// AI 서버용 Axios
// 필요 시에 적절히 변경
//const BASE_URL = import.meta.env.VITE_BASE_URL_AI;
const BASE_URL = "https://k11c105.p.ssafy.io/";
// api/v1/recommend
const AIAxios = axios.create({
  baseURL: BASE_URL,
  // timeout: 10000, // 10초
  // 추가적인 설정이 필요할 경우 여기에 작성
});

export default AIAxios;
