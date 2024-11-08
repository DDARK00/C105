import { create } from "zustand";
import { persist } from "zustand/middleware"; // persist 미들웨어 가져오기

export const useProjectListStore = create(
  persist(
    (set) => ({
      projects: [],
      nextProjectId: 1,
      methods: [
        "get",
        "post",
        "delete",
        "put",
        "patch",
        "options",
        "connect",
        "head",
        "trace",
      ],
      importanceLevels: ["high", "middle", "low"],
      addProject: (projectData) => {
        set((state) => ({
          projects: [
            ...state.projects,
            {
              project_id: state.nextProjectId,
              gitlab_project_id: projectData.gitlab_project_id || null,
              name: projectData.name,
              projectType: projectData.projectType,
              description: projectData.description,
              gitlab_name: projectData.gitlab_name,
              gitlab_url: projectData.gitlab_url,
              members: [],
            },
          ],
          nextProjectId: state.nextProjectId + 1,
        }));
      },
      addMemberToProject: (projectId, member) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.project_id === projectId
              ? { ...project, members: [...project.members, member] }
              : project
          ),
        }));
      },
    }),
    {
      name: "project-storage", // 로컬 스토리지에 저장될 키 이름
      partialize: (state) => ({
        projects: state.projects,
        nextProjectId: state.nextProjectId,
      }), // 저장할 상태만 선택적으로 저장
    }
  )
);
