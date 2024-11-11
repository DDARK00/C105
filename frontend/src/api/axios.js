import AIAxios from "./http-commons/AIAxios";
import authAxiosInstance from "./http-commons/authAxios";
import {
  colors,
  darkColors,
  animations,
} from "../components/ideaboard/variable";

/**
 * try-catch helper func
 * 트라이-캐치를 수행하는 함수
 * @param {import("axios").AxiosInstance} cbFunc
 * @returns
 */
const helper = async (cbFunc, type = "미입력") => {
  if (!cbFunc) return { ok: false };
  try {
    const response = await cbFunc();

    return { ok: true, data: response.data }; // 비동기 호출에 await 추가
  } catch (error) {
    console.error("에러: ", type, "/ status: ", error); // 에러를 한 줄로 처리
    return { ok: false, message: error?.response?.data?.message };
  }
};

// --------------------프로젝트 api 시작---------------------
// gitlab의프로젝트 목록 조회
export const fetchGitlabProjectList = async () => {
  const response = await helper(
    () => authAxiosInstance.get("api/v1/project/gitlab"),
    "gitlab 프로젝트 목록"
  );
  if (!response.ok) return;
  // console.log(response.data.data);
  return response?.data?.data;
};

// 우리 서비스의 자신의 프로젝트 리스트 조회
export const fetchProjectList = async () => {
  const response = await helper(
    () => authAxiosInstance.get("api/v1/project"),
    "프로젝트 목록"
  );
  if (!response.ok) return;
  // console.log(response.data);
  return response?.data?.data;
};

// 우리 서비스의 자신의 프로젝트 생성
export const createProject = async (projectData) => {
  const response = await helper(
    () => authAxiosInstance.post("api/v1/project/create", projectData),
    "프로젝트 생성"
  );
  if (!response.ok) return { status: false, message: response?.message };

  console.log("프로젝트 생성", response.data);
  return { status: true, data: response.data };
};

export const deleteProject = async (projectId) => {
  const response = await helper(
    () => authAxiosInstance.delete(`api/v1/project/${projectId}/delete`),
    "프로젝트 삭제"
  );
  if (!response.ok) return;

  console.log("프로젝트 삭제", response.data);
  return true;
};

export const createIdea = async (projectId) => {
  // 랜덤한 x, y 좌표 생성
  const x = `${Math.floor(Math.random() * 85 + 0)}`; // x 범위 0% ~ 86%
  const y = `${Math.floor(Math.random() * 67 + 5)}`; // y 범위 5% ~ 71%

  // colors, darkColors, animations 배열에서 랜덤 요소 선택
  const index = Math.floor(Math.random() * colors.length);
  const color = colors[index];
  const darkColor = darkColors[index];
  const animation = animations[Math.floor(Math.random() * animations.length)];
  // 요청에 보낼 데이터 정의
  console.log(x, y, color, darkColor, animation);
  const data = {
    x,
    y,
    color,
    darkColor,
    animation,
  };
  console.log(data);
  const response = await helper(
    () => authAxiosInstance.post(`api/v1/idea/${projectId}/create`, data),
    "아이디어 생성"
  );
  if (!response.ok) return;

  console.log("아이디어 생성", response.data);
  return true;
};

export const fetchIdea = async (projectId) => {
  const response = await helper(
    () => authAxiosInstance.get(`api/v1/idea/${projectId}`),
    "아이디어 목록 조회"
  );
  if (!response.ok) return;

  console.log("아이디어 목록 조회", response.data);
  return response?.data?.data;
};

export const fetchIdeaDetail = async (projectId, ideaId) => {
  const response = await helper(
    () =>
      authAxiosInstance.get(
        `gateway/project-service/api/v1/idea/${projectId}/${ideaId}`
      ),
    "아이디어 상세 조회"
  );
  if (!response.ok) return;

  console.log("아이디어 상세 조회", response.data);
  return response?.data?.data;
};

export const updateIdea = async (ideaId, x, y) => {
  const response = await helper(
    () => authAxiosInstance.put(`api/v1/idea/${ideaId}/update`, { x, y }),
    "아이디어 수정"
  );
  if (!response.ok) return;

  console.log("아이디어 수정", response.data);
  return response?.data?.data;
};

export const deleteIdea = async (ideaId) => {
  console.log(ideaId);
  const response = await helper(
    () => authAxiosInstance.delete(`api/v1/idea/${ideaId}/delete`),
    "아이디어 삭제"
  );
  if (!response.ok) return;

  console.log("아이디어 삭제", response.data);
  return true;
};

export const selectIdea = async (ideaId) => {
  const response = await helper(
    () =>
      authAxiosInstance.put(
        `gateway/project-service/api/v1/idea/${ideaId}/select`
      ),
    "아이디어 채택"
  );
  if (!response.ok) return;

  console.log("아이디어 채택", response.data);
  return true;
};

export const unselectIdea = async (ideaId) => {
  const response = await helper(
    () =>
      authAxiosInstance.put(
        `gateway/project-service/api/v1/idea/${ideaId}/unselect`
      ),
    "아이디어 채택 취소"
  );
  if (!response.ok) return;

  console.log("아이디어 채택 취소", response.data);
  return true;
};

// --------------------프로젝트 api 끝---------------------

// --------------------마인드맵 api 시작---------------------
// 마인드맵 조회
export const fetchMindMap = async (projectId) => {
  const response = await helper(
    () => authAxiosInstance.get(`api/v1/mindmap/${projectId}`),
    "마인드맵 조회"
  );
  if (!response.ok) return;
  // console.log(response.data);
  return response?.data?.data;
};

// 마인드맵 생성
export const createMindMap = async ({ projectId, mainKeyword, keywords }) => {
  const response = await helper(
    () =>
      authAxiosInstance.post(`api/v1/mindmap/${projectId}/create`, {
        mainKeyword,
        keywords,
      }),
    "마인드맵 생성"
  );
  if (!response.ok) return;

  console.log("마인드맵 생성", response.data);
  return response?.data?.data;
};

// 마인드맵 서브 키워드 조회
export const fetchMindMapSubKeyword = async (keyword) => {
  const response = await helper(
    () => AIAxios.get(`api/v1/search/recommend?keyword=${keyword}`),
    "마인드맵 서브 키워드 조회"
  );
  if (!response.ok) return;
  // console.log(response.data);
  return response?.data?.data;
};

// 마인드맵 핫힌 키워드 조회
export const fetchMindMapHotKeyword = async () => {
  const response = await helper(
    () => AIAxios.get(`api/v1/search/hot-keyword`),
    "마인드맵 핫힌 키워드 조회"
  );
  if (!response.ok) return;
  // console.log(response.data);
  return response?.data?.data;
};

// 마인드맵-> 깃허브 조회
export const fetchAllGenGithubPJTtoKeyword = async (keyword) => {
  const response = await helper(
    () => AIAxios.get(`api/v1/search?keyword=${keyword}`),
    "마인드맵-> 깃허브 조회"
  );
  if (!response.ok) return;
  // console.log(response.data);
  return response?.data;
};

// 마인드맵 키워드 -> 뉴스 조회
export const fetchNewstoKeyword = async (keyword) => {
  const response = await helper(
    () => AIAxios.get(`api/v1/search/news?query=${keyword}`),
    "마인드맵 키워드 -> 뉴스 조회"
  );
  if (!response.ok) return;
  // console.log(response.data);
  return response?.data;
};

// --------------------기획서 api 시작---------------------
// 기획서 조회

export const getProposal = async (ideaId) => {
  const response = await helper(
    () => authAxiosInstance.get(`api/v1/planner/${ideaId}`),
    "기획서 조회"
  );
  if (!response.ok) return;
  // console.log(response.data);
  return response?.data?.data;
};
