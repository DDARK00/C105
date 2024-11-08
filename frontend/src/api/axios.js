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

export const fetchGitlabProjectList = async () => {
  const response = await helper(
    () => authAxiosInstance.get("api/v1/project/gitlab"),
    "gitlab 프로젝트 목록"
  );
  if (!response.ok) return;
  // console.log(response.data.data);
  return response?.data?.data;
};

export const fetchProjectList = async () => {
  const response = await helper(
    () => authAxiosInstance.get("api/v1/project"),
    "프로젝트 목록"
  );
  if (!response.ok) return;
  // console.log(response.data);
  return response?.data?.data;
};

export const createProject = async (projectData) => {
  const response = await helper(
    () => authAxiosInstance.post("api/v1/project/create", projectData),
    "프로젝트 생성"
  );
  if (!response.ok) return;

  console.log("프로젝트 생성", response.data);
  return response?.data?.data;
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
