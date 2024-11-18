// ProposalPage.jsx
import { RoomProvider } from "@liveblocks/react";
import { useLocation } from "react-router-dom";
import { ClientSideSuspense } from "@liveblocks/react";
import { Helmet } from "react-helmet-async";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import mermaid from "mermaid";
import ProposalEditor from "../../components/proposal/ProposalEditor";
import { LiveObject } from "@liveblocks/client";

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
});

const Room = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <RoomProvider
      initialStorage={{
        fieldValues: new LiveObject({
          content:
            "# MARKDOWN\n ## 문법을\n ### 사용해서\n #### 기획서를 작성하세요.",
        }),
      }}
      id={`proposal-room-${pathname}`}
    >
      <ClientSideSuspense fallback={<LoadingSpinner message={"wait..."} />}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default function ProposalPage() {
  return (
    // RoomProvider로 ProposalEditor를 감싸서 Liveblocks 방 기능을 제공합니다.
    <>
      <Room>
        <Helmet>
          <title>GOODIDEA - 기획서</title>
        </Helmet>
        <ProposalEditor />
      </Room>
    </>
  );
}
