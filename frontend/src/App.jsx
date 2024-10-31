import "./App.css";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./page/MainPage";
import NotFoundPage from "./page/NotFoundPage";
import CommonLayout from "./components/CommonLayout";
import ApiSpecificationPage from "./page/project/ApiSpecificationPage";
import MindMapPage from "./page/project/MindMapPage";
import ERDPage from "./page/project/ERDPage";
import IdeaBoardPage from "./page/project/IdeaBoardPage";
import ProjectEssentialPage from "./page/project/ProjectEssentialPage";
import ProposalPage from "./page/project/ProposalPage";
import RequirementsSpecificationPage from "./page/project/RequirementsSpecificationPage";
import FlowChartPage from "./page/project/FlowChartPage";
import ProjectListPage from "./page/ProjectListPage";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<CommonLayout />}>
            {/* 메인 페이지 */}
            <Route index element={<MainPage />} />

            {/* 프로젝트 목록 페이지*/}
            <Route path="/projectList" element={<ProjectListPage />} />

            <Route path="/project/:id">
              {/* 프로젝트 기본 정보 페이지 */}
              <Route index element={<ProjectEssentialPage />} />

              {/* 마인드맵 페이지 */}
              <Route path="/project/:id/mindmap" element={<MindMapPage />} />

              {/* 아이디어보드페이지 */}
              <Route
                path="/project/:id/ideaboard"
                element={<IdeaBoardPage />}
              />

              {/* 기획서 페이지 */}
              <Route
                path="/project/:id/idea/:ideaid/proposal"
                element={<ProposalPage />}
              />

              {/* api명세서 페이지 */}
              <Route
                path="/project/:id/idea/:ideaid/apispecification"
                element={<ApiSpecificationPage />}
              />

              {/* ERD페이지 */}
              <Route
                path="/project/:id/idea/:ideaid/erd"
                element={<ERDPage />}
              />

              {/* 요구사항 명세서 페이지 */}
              <Route
                path="/project/:id/idea/:ideaid/requirementsspecification"
                element={<RequirementsSpecificationPage />}
              />

              {/* 플로우차트 페이지 */}
              <Route
                path="/project/:id/idea/:ideaid/flowchart"
                element={<FlowChartPage />}
              />
            </Route>
          </Route>

          {/* 404 not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
