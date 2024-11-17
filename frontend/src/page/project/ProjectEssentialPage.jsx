import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";
import ProjectEssentialEditor from "../../components/projectessential/ProjectEssentialEditor";

const Room = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <RoomProvider
      id={`essential-room-${pathname}`}
      initialStorage={{
        fieldValues: new LiveObject({
          teamGitlabCode: "",
          teamName: "",
          projectName: "",
          figmaLink: "",
          jiraLink: "",
          teamInfo: "",
        }),
      }}
    >
      <ClientSideSuspense fallback={<div>loading...</div>}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

function ProjectEssentialPage() {
  // Liveblocks의 storage에서 공유 객체 가져오기

  return (
    <>
      <Room>
        <Helmet>
          <title>프로젝트 기본 정보 페이지</title>
        </Helmet>
        <ProjectEssentialEditor />
      </Room>
    </>
  );
}

export default ProjectEssentialPage;
