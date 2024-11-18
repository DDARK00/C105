import React, { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { useLocation } from "react-router-dom";
import { LiveObject } from "@liveblocks/client";

const ERDDrawing = React.lazy(() => import("../../components/erd/ERDDrawing"));

/*  
  *
  1. z-index 빵빵하게 준 가이드 페이지 작성해서 유저가 사용법 알 수 있도록 추가 필요
  2. 툴팁 만들어서 대충 사용법 알 수 있도록 수정 필요
  */

const Room = ({ children }) => {
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <RoomProvider
      id={`erd-room-${pathname}`}
      initialStorage={{
        erdData: new LiveObject({
          tables: "",
        }),
      }}
    >
      <ClientSideSuspense fallback={<div>loading...</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

function ERDPage() {
  return (
    <>
      <Room>
        <Helmet>
          <title>ERD페이지</title>
        </Helmet>

        <Suspense fallback={<LoadingSpinner />}>
          <ERDDrawing />
        </Suspense>
      </Room>
    </>
  );
}

export default ERDPage;
