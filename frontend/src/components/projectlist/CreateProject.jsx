import { useEffect, useState } from "react";
import { createProject, fetchGitlabProjectList } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useProjectListStore } from "../../store/useProjectListStore";
import useGlobalLoadingStore from "../../store/useGlobalLoadingStore";

const ProjectCard = ({ title, handleReader }) => {
  return (
    <div className="bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col items-center justify-between min-h-full">
      <h2 className="text-lg font-semibold">{title}</h2>
      <hr className="w-full border-gray-300 my-2" />
      <div className="flex flex-col space-y-4 mt-4 w-full">
        <button
          onClick={() => handleReader(title)}
          className="px-4 py-2 bg-gray-200 rounded-full cursor-pointer text-gray-700 hover:bg-gray-300 transition"
        >
          시작하기
        </button>
        <p className="text-center">
          주의! 프로젝트를 시작한 인원이 팀장으로 지정됩니다
        </p>
      </div>
    </div>
  );
};

const ReaderWritePage = ({ title, onClose }) => {
  const { startLoading, stopLoading } = useGlobalLoadingStore();
  const [gitlabProjectList, setGitlabProjectList] = useState([]);
  const [projectData, setProjectData] = useState({
    projectId: "", // GITLAB Respository 입력 값을 저장할 필드
    teamName: "", // 팀 이름 입력 값을 저장할 필드
    projectType: title.split(" ")[0], // title에서 첫 단어 추출하여 저장
  });

  const navigate = useNavigate();
  // GitLab 프로젝트 목록을 가져오는 useEffect
  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await fetchGitlabProjectList();
      setGitlabProjectList(projects);
    };
    fetchProjects();
  }, []);

  // input, select 변경 시 호출되는 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // select 요소 변경 시 선택된 project의 id를 projectId에 할당
  const handleSelectChange = (e) => {
    const selectedProjectId = e.target.value;
    setProjectData((prevData) => ({
      ...prevData,
      projectId: Number(selectedProjectId),
    }));
  };

  // 프로젝트 생성 버튼 클릭 시 호출되는 함수
  const handleButtonClick = async () => {
    try {
      startLoading();
      const isCreate = await createProject(projectData);
      if (isCreate?.status) {
        if (isCreate.data?.data)
          useProjectListStore.setState({
            projects: [
              ...useProjectListStore.getState().projects,
              isCreate.data?.data,
            ],
          });
        // console.log(isCreate.data?.data);
        onClose();
        navigate(`/project/${isCreate?.data?.data?.project_id}`);
      } else {
        window.alert(
          "프로젝트 생성에 실패했습니다. " + (isCreate?.message ?? "")
        );
      }
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col items-center justify-between min-h-full space-y-4 w-full">
      <h2 className="text-lg font-semibold">{title}</h2>
      <hr className="w-full border-gray-300 my-2" />

      <div className="w-full space-y-4">
        <label className="flex flex-col text-left w-full">
          GITLAB Respository:
          <select
            name="projectId"
            value={projectData.projectId}
            onChange={handleSelectChange}
            className="mt-1 p-2 border rounded w-full text-gray-700 bg-gray-50"
          >
            <option value="" disabled>
              프로젝트를 선택하세요
            </option>
            {gitlabProjectList.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-left w-full">
          팀 이름 :
          <input
            type="text"
            placeholder="팀 이름을 입력하세요."
            name="teamName"
            value={projectData.teamName}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded w-full text-gray-700 bg-gray-50"
          />
        </label>

        {/* <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span className="text-gray-600">정보가 정확한가요?</span>
        </label> */}
      </div>

      <button
        className="px-6 py-3 bg-gray-200 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-300 transition text-lg w-full"
        onClick={handleButtonClick}
      >
        시작하기
      </button>
    </div>
  );
};

const CreateProject = ({ onClose }) => {
  const [page, setPage] = useState("project");
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");

  const handleReader = (title) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedTitle(title);
      setPage("readerWrite");
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="flex justify-center items-center h-full overflow-hidden">
      {/* 첫 번째 컴포넌트 (카드 목록) */}
      {page === "project" && (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-8 p-10 w-full h-full transition-all duration-500 transform ${
            isAnimating ? "opacity-0 blur-sm" : "opacity-100 blur-0"
          }`}
        >
          {[
            "관통 프로젝트",
            "공통 프로젝트",
            "특화 프로젝트",
            "자율 프로젝트",
          ].map((title, index) => (
            <ProjectCard
              key={index}
              title={title}
              handleReader={handleReader}
            />
          ))}
        </div>
      )}

      {/* 두 번째 컴포넌트 (작성 페이지) */}
      {page === "readerWrite" && (
        <div
          className={`transition-all duration-500 transform w-full ${
            isAnimating ? "opacity-0 blur-sm" : "opacity-100 blur-0"
          }`}
        >
          <ReaderWritePage onClose={onClose} title={selectedTitle} />
        </div>
      )}
    </div>
  );
};

export default CreateProject;
