import Divier from "../common/Divier";

function ProjectListItemSkeleton() {
  return (
    <>
      <Divier />
      <div className="flex items-center justify-between my-2 px-4 animate-pulse">
        {/* 좌측 스켈레톤 */}
        <div className="flex items-center gap-4 cursor-pointer">
          {/* 프로필 아이콘 스켈레톤 */}
          <div className="w-10 h-10 rounded-md bg-gray-300" />
          <div className="flex flex-col">
            {/* 팀명, 프로젝트명 스켈레톤 */}
            <span className="w-24 h-5 bg-gray-300 rounded-md mb-1"></span>
            <span className="w-16 h-4 bg-gray-300 rounded-md"></span>
          </div>
        </div>

        {/* 우측 스켈레톤 */}
        <div className="w-20 h-5 bg-blue-200 rounded-md cursor-pointer" />
      </div>
    </>
  );
}

export default ProjectListItemSkeleton;
