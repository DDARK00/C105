import { useNavigate } from "react-router-dom";
import Divier from "../common/Divier";

function ProjectListItem({ project }) {
  // console.log(project);
  const navigate = useNavigate();
  const navigateDetail = () => {
    // navigate to detail page
    navigate(`/project/${project.project_id}`);
  };
  return (
    <>
      <Divier />
      <div
        key={project.id}
        className="flex items-center justify-between my-2 px-4"
      >
        {/* 좌측 */}
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={navigateDetail}
        >
          <div className="w-10 h-10 rounded-md bg-gray-200 items-center justify-center flex font-bold text-2xl">
            {project?.gitlabName[0]}
          </div>
          <div className="flex flex-col hover:underline">
            <span className="font-thin text-lg">
              {project.gitlabName} /{" "}
              <span className="font-medium"> {project.teamName}</span>
            </span>
            <span className="text-sm text-gray-500">{project.projectType}</span>
          </div>
        </div>

        {/* 우측 */}
        <a
          href={project.gitlab_url}
          className="flex hover:underline-offset-4 items-center h-full hover:underline cursor-pointer"
          target="_blank" /* 새 탭에서 열기 */
          rel="noopener noreferrer"
        >
          <strong className="text-sm text-[rgb(59,130,246)]">
            Go to Gitlab
          </strong>
        </a>
      </div>
    </>
  );
}

export default ProjectListItem;
