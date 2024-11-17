import { Helmet } from "react-helmet-async";
import RequirementsTable from "../../components/requirementsspecification/RequirementsTable";
import { useLocation } from "react-router-dom";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";

const Room = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <RoomProvider
      id={`essential-room-${pathname}`}
      initialStorage={{
        requirements: new LiveList([]), // requirements를 LiveList로 초기화
      }}
    >
      <ClientSideSuspense fallback={<div>loading...</div>}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
function RequirementsSpecificationPage() {
  return (
    <>
      <Helmet>
        <title>요구사항명세서페이지</title>
      </Helmet>
      <Room>
        <RequirementsTable />
      </Room>
    </>
  );
}

export default RequirementsSpecificationPage;
