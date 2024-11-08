import { create } from "zustand";

const useProjectStore = create((set) => ({
  // 프로젝트 정보
  projectId: null,
  gitlabProjectId: null,
  teamName: null,
  projectType: null,
  leader: null,
  mainIdea: null,
  gitlabName: null,
  gitlabUrl: null,
  members: [],

  // 프로젝트 정보 설정
  setProjectInfo: (projectData) =>
    set({
      projectId: projectData.project_id,
      gitlabProjectId: projectData.gitlab_project_id,
      teamName: projectData.teamName,
      projectType: projectData.projectType,
      leader: projectData.leader,
      mainIdea: projectData.mainIdea,
      gitlabName: projectData.gitlabName,
      gitlabUrl: projectData.gitlab_url,
      members: projectData.members,
    }),

  // 초기화
  clearProjectInfo: () =>
    set({
      projectId: null,
      gitlabProjectId: null,
      teamName: null,
      projectType: null,
      leader: null,
      mainIdea: null,
      gitlabName: null,
      gitlabUrl: null,
      members: [],
    }),
}));

export default useProjectStore;
