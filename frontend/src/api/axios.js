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

// --------------------유저 api 시작---------------------

// 유저 정보 조회
export const fetchUserInfo = async () => {
  const response = await helper(
    () => authAxiosInstance.get("gateway/user-service/api/v1/user/profile"),
    "유저 정보 조회"
  );

  if (!response.ok) return;
  return response?.data?.data;
};

// 유저 정보 수정
export const updateUserInfo = async (userProfile) => {
  const response = await helper(
    () =>
      authAxiosInstance.put(
        "gateway/user-service/api/v1/user/update",
        userProfile
      ),
    "유저 정보 수정"
  );

  if (!response.ok) return;
  return response?.data?.data;
};

// --------------------유저 api 끝---------------------

// --------------------프로젝트 api 시작---------------------
// gitlab의프로젝트 목록 조회
export const fetchGitlabProjectList = async () => {
  const response = await helper(
    () =>
      authAxiosInstance.get("gateway/project-service/api/v1/project/gitlab"),
    "gitlab 프로젝트 목록"
  );
  if (!response.ok) return;
  return response?.data?.data;
};

// 우리 서비스의 자신의 프로젝트 리스트 조회
export const fetchProjectList = async ({ grade, projectType } = {}) => {
  let query = "";
  if (grade || projectType) {
    query =
      "?" +
      (grade ? `grade=${grade}` : "") +
      (projectType ? `&projectType=${projectType}` : "");
  }
  const response = await helper(
    () =>
      authAxiosInstance.get("gateway/project-service/api/v1/project" + query),
    "프로젝트 목록"
  );
  if (!response.ok) return;
  return response?.data?.data;
};

// 우리 서비스의 자신의 프로젝트 생성
export const createProject = async (projectData) => {
  const response = await helper(
    () =>
      authAxiosInstance.post(
        "gateway/project-service/api/v1/project/create",
        projectData
      ),
    "프로젝트 생성"
  );
  if (!response.ok) return { status: false, message: response?.message };

  return { status: true, data: response.data };
};

export const fetchProjectDetail = async (projectId) => {
  const response = await helper(
    () =>
      authAxiosInstance.get(
        `gateway/project-service/api/v1/project/${projectId}`
      ),
    "프로젝트 상세 조회"
  );
  if (!response.ok) return;
  return response?.data?.data;
};

export const deleteProject = async (projectId) => {
  const response = await helper(
    () =>
      authAxiosInstance.delete(
        `gateway/project-service/api/v1/project/${projectId}/delete`
      ),
    "프로젝트 삭제"
  );
  if (!response.ok) return;
  return true;
};

export const createIdea = async (projectId, stickerData) => {
  // 랜덤한 x, y 좌표 생성
  const x = `${Math.floor(Math.random() * 85 + 0)}`; // x 범위 0% ~ 86%
  const y = `${Math.floor(Math.random() * 67 + 5)}`; // y 범위 5% ~ 71%

  // colors, darkColors, animations 배열에서 랜덤 요소 선택
  const index = Math.floor(Math.random() * colors.length);
  const color = colors[index];
  const darkColor = darkColors[index];
  const animation = animations[Math.floor(Math.random() * animations.length)];

  // 기본 랜덤 데이터 정의
  const randomData = {
    x,
    y,
    color,
    darkColor,
    animation,
  };

  // stickerData가 존재하면 사용, 없으면 randomData 사용
  const data = stickerData ? { ...stickerData, ...randomData } : randomData;

  // 요청 보내기
  const response = await helper(
    () =>
      authAxiosInstance.post(
        `gateway/project-service/api/v1/idea/${projectId}/create`,
        data
      ),
    "아이디어 생성"
  );

  if (!response.ok) return;
  return true;
};

export const fetchIdea = async (projectId) => {
  const response = await helper(
    () =>
      authAxiosInstance.get(`gateway/project-service/api/v1/idea/${projectId}`),
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

  console.log(
    "아이디어 상세 조회(여기에 있는 comment 필드로 댓글 조회 가능)",
    response.data
  );
  return response?.data?.data;
};

export const updateIdea = async (ideaId, ideaData) => {
  const {
    serviceName,
    background,
    introduction,
    target,
    expectedEffect,
    x,
    y,
    color,
    darkColor,
    animation,
  } = ideaData;
  console.log(ideaData);
  const response = await helper(
    () =>
      authAxiosInstance.put(
        `gateway/project-service/api/v1/idea/${ideaId}/update`,
        {
          serviceName,
          background,
          introduction,
          target,
          expectedEffect,
          x,
          y,
          color,
          darkColor,
          animation,
        }
      ),
    "아이디어 수정"
  );

  if (!response.ok) return;
  return response?.data?.data;
};

export const deleteIdea = async (ideaId) => {
  console.log(ideaId);
  const response = await helper(
    () =>
      authAxiosInstance.delete(
        `gateway/project-service/api/v1/idea/${ideaId}/delete`
      ),
    "아이디어 삭제"
  );
  if (!response.ok) return;
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
  return true;
};

export const createIdeaComment = async (ideaId, payload) => {
  const { commentContent, rating } = payload;
  const response = await helper(
    () =>
      authAxiosInstance.post(
        `gateway/project-service/api/v1/idea/comment/${ideaId}/create`,
        { commentContent, rating }
      ),
    "아이디어 댓글 작성"
  );
  if (!response.ok) return;
  return true;
};

// --------------------프로젝트 api 끝---------------------

// --------------------마인드맵 api 시작---------------------
// 마인드맵 조회
export const fetchMindMap = async (projectId) => {
  const response = await helper(
    () =>
      authAxiosInstance.get(
        `gateway/project-service/api/v1/mindmap/${projectId}`
      ),
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
      authAxiosInstance.post(
        `gateway/project-service/api/v1/mindmap/${projectId}/create`,
        {
          mainKeyword,
          keywords,
        }
      ),
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
    () =>
      authAxiosInstance.get(`gateway/project-service/api/v1/planner/${ideaId}`),
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
