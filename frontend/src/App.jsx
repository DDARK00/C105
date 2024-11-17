import React, { Suspense } from "react";
import "./App.css";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LiveblocksProvider } from "@liveblocks/react";
import { createClient } from "@liveblocks/client"; // @liveblocks/client에서 createClient 가져오기
import CommonLayout from "./components/CommonLayout";

// default 페이지
import MainPage from "./page/MainPage";
import NotFoundPage from "./page/NotFoundPage";
import LoginPage from "./page/LoginPage";
import liveblocksClient from "../liveblocks.config"; // Liveblocks 클라이언트 import

import LoadingSpinner from "./components/common/LoadingSpinner";

// 프로젝트 정보
const LazyProjectListPage = React.lazy(() => import("./page/ProjectListPage"));
const LazyProjectEssentialPage = React.lazy(() =>
  import("./page/project/ProjectEssentialPage")
);

// 환경변수 확인
console.log("Public Key from env:", import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY);

const client = createClient({
  publicApiKey:
    "pk_dev_nJXrR6Wtow_BqktuYQvAWmBdZ7ybi5UK7O-0_Ix1DlBiVGTSKzWxCSZeSDT5oWsh",
});
// 산출물 목록들 페이지
const LazyMindMapPage = React.lazy(() => import("./page/project/MindMapPage"));
const LazyIdeaBoardPage = React.lazy(() =>
  import("./page/project/IdeaBoardPage")
);
const LazyProposalPage = React.lazy(() =>
  import("./page/project/ProposalPage")
);
const LazyApiSpecificationPage = React.lazy(() =>
  import("./page/project/ApiSpecificationPage")
);
const LazyERDPage = React.lazy(() => import("./page/project/ERDPage"));
const LazyRequirementsSpecificationPage = React.lazy(() =>
  import("./page/project/RequirementsSpecificationPage")
);
const LazyFlowChartPage = React.lazy(() =>
  import("./page/project/FlowChartPage")
);

function App() {
  return (
    <HelmetProvider>
      <LiveblocksProvider
        resolveUsers={({ userIds }) => {
          console.log(userIds, "userIds"); // 이제 userIds가 배열로 출력됩니다.
          return userIds.map((userId) => ({
            name: "Anonymous", // 모든 사용자에게 'Anonymous'라는 이름을 반환
          }));
        }}
        publicApiKey="pk_dev_nJXrR6Wtow_BqktuYQvAWmBdZ7ybi5UK7O-0_Ix1DlBiVGTSKzWxCSZeSDT5oWsh"
      >
        <BrowserRouter>
          <Routes>
            <Route path="" element={<CommonLayout />}>
              {/* 메인 페이지 */}
              <Route index element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* 프로젝트 목록 페이지*/}
              <Route
                path="/projectList"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyProjectListPage />
                  </Suspense>
                }
              />

              <Route path="/project/:id">
                {/* 프로젝트 기본 정보 페이지 */}
                <Route
                  index
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LazyProjectEssentialPage />
                    </Suspense>
                  }
                />

                {/* 마인드맵 페이지 */}
                <Route
                  path="/project/:id/mindmap"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LazyMindMapPage />
                    </Suspense>
                  }
                />

                {/* 아이디어보드페이지 */}
                <Route
                  path="/project/:id/ideaboard"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LazyIdeaBoardPage />
                    </Suspense>
                  }
                />

                {/* 기획서 페이지 */}
                <Route
                  path="/project/:id/idea/:ideaId/proposal"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LazyProposalPage />
                    </Suspense>
                  }
                />

                {/* api명세서 페이지 */}
                <Route
                  path="/project/:id/idea/:ideaId/apispecification"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LazyApiSpecificationPage />
                    </Suspense>
                  }
                />

                {/* ERD페이지 */}
                <Route
                  path="/project/:id/idea/:ideaId/erd"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LazyERDPage />
                    </Suspense>
                  }
                />

                {/* 요구사항 명세서 페이지 */}
                <Route
                  path="/project/:id/idea/:ideaId/requirementsspecification"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LazyRequirementsSpecificationPage />
                    </Suspense>
                  }
                />

                {/* 플로우차트 페이지 */}
                <Route
                  path="/project/:id/idea/:ideaId/flowchart"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LazyFlowChartPage />
                    </Suspense>
                  }
                />
              </Route>
            </Route>

            {/* 404 not found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </LiveblocksProvider>
    </HelmetProvider>
  );
}

export default App;
