import AIAxios from "./http-commons/AIAxios";
import authAxiosInstance from "./http-commons/authAxios";

/**
 * try-catch helper func
 * 트라이-캐치를 수행하는 함수
 * @param {import("axios").AxiosInstance} cbFunc
 * @returns
 */
const helper = async (cbFunc, type = "미입력") => {
  if (!cbFunc) return { ok: false };
  try {
    return { ok: true, data: (await cbFunc()).data }; // 비동기 호출에 await 추가
  } catch (error) {
    console.error("에러: ", type, "/ status: ", error); // 에러를 한 줄로 처리
    return { ok: false };
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
  if (!response.ok) return;

  console.log("프로젝트 생성", response.data);
  return true;
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

export const updateProposal = async (ideaId, content) => {
  const response = await helper(
    () => authAxiosInstance.put(`api/v1/planner/${ideaId}`, { content }),
    "기획서 수정"
  );
  if (!response.ok) return;
  return response?.data?.data;
};

// --------------------liveblocks api 시작---------------------
// export const getLiveblcoksToken = async (ideaId, documentType) => {
//   const response = await helper(
//     () =>
//       authAxiosInstance.post("api/v1/liveblocks/auth", {
//         ideaId,
//         documentType,
//       }),
//     "Liveblocks 토큰 발급"
//   );
//   if (!response.ok) return;
//   // console.log(response.data);
//   return response?.data?.data; // 토큰 반환
// };
