import { Helmet } from "react-helmet-async";
import ApiSpecTable from "../../components/apispecification/ApiSpecTable";
import { useLocation } from "react-router-dom";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Room = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <RoomProvider
      id={`essential-room-${pathname}`}
      initialStorage={{
        apiSpecifications: new LiveList([]), // ApiSpec을 LiveList로 초기화
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner message={"Loading... "} />}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

function ApiSpecificationPage() {
  return (
    <>
      <Helmet>
        <title>GOODIDEA - API 명세서</title>
      </Helmet>
      <Room>
        <ApiSpecTable />
      </Room>
    </>
  );
}

export default ApiSpecificationPage;
