import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProjectStore = create(
  persist(
    (set, get) => ({
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

      hasMainIdea: () => {
        const state = get();
        return (
          state.mainIdea !== null &&
          state.mainIdea !== undefined &&
          state.mainIdea !== ""
        );
      },

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
    }),
    {
      name: "project-storage", // 로컬 스토리지에 저장될 키 이름
      getStorage: () => localStorage, // (옵션) 로컬 스토리지를 사용
    }
  )
);

export default useProjectStore;
