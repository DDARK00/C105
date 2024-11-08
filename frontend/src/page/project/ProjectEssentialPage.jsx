import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as Y from "yjs";
import { HocuspocusProvider, TiptapCollabProvider } from "@hocuspocus/provider";
import DefaultButton from "../../components/common/DefaultButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteProject } from "../../api/axios";
// Yjs 문서 생성 및 필드 초기화
const doc = new Y.Doc();
const fields = {
  teamGitlabCode: doc.getText("teamGitlabCode"),
  teamName: doc.getText("teamName"),
  teamMembers: doc.getText("teamMembers"),
  projectName: doc.getText("projectName"),
  figmaLink: doc.getText("figmaLink"),
  jiraLink: doc.getText("jiraLink"),
  gitlabLink: doc.getText("gitlabLink"),
  teamInfo: doc.getText("teamInfo"),
};

// // 초기값 설정
// Object.keys(fields).forEach((key) => {
//   console.log(fields[key].toString());
//   if (fields[key].toString() === "") {
//     fields[key].insert(0, ""); // 필요시 초기값 설정
//   }
// });

function ProjectEssentialPage() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params?.id;

  const [fieldValues, setFieldValues] = useState({
    teamGitlabCode: "",
    teamName: "",
    teamMembers: "",
    projectName: "",
    figmaLink: "",
    jiraLink: "",
    gitlabLink: "",
    teamInfo: "",
  });

  useEffect(() => {
    const provider = new HocuspocusProvider({
      url: "ws://localhost:3001", // WebSocket URL
      document: doc,
      // appId: "7j9y6m10",
      name: "projectEssential_private", // 문서의 고유 식별자
      token: "notoken", // JWT 토큰 (필요에 따라 설정)
      onSynced: () => {
        console.log("Synced with server");
      },
    });

    // Yjs 문서의 변경 사항을 React 상태와 동기화
    const updateFieldValues = () => {
      console.log("updateFieldValues called");
      const newFieldValues = {
        teamGitlabCode: fields.teamGitlabCode.toString(),
        teamName: fields.teamName.toString(),
        teamMembers: fields.teamMembers.toString(),
        projectName: fields.projectName.toString(),
        figmaLink: fields.figmaLink.toString(),
        jiraLink: fields.jiraLink.toString(),
        gitlabLink: fields.gitlabLink.toString(),
        teamInfo: fields.teamInfo.toString(),
      };

      // 변경이 있을 때만 상태 업데이트
      if (JSON.stringify(newFieldValues) !== JSON.stringify(fieldValues)) {
        setFieldValues(newFieldValues);
      }
    };
    doc.on("load", updateFieldValues);

    // Yjs 문서 변경 시 updateFieldValues 실행
    doc.on("update", updateFieldValues);

    return () => {
      provider.destroy();
      doc.off("update", updateFieldValues);
    };
  }, [fieldValues]);

  // 입력 필드 변경 시 Yjs 문서 업데이트
  const handleChange = (field, value) => {
    fields[field].delete(0, fields[field].length); // 이전 텍스트 제거
    fields[field].insert(0, value); // 새 텍스트 삽입
  };

  return (
    <>
      <Helmet>
        <title>프로젝트 기본 정보 페이지</title>
      </Helmet>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 flex justify-center items-center bg-gray-100 py-8">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-900 text-white py-6 px-8 rounded-t-lg">
              <h1 className="text-2xl font-bold">프로젝트 필수 정보</h1>
              <p className="text-sm text-blue-200">Team Information & Links</p>
            </div>
            <div className="p-8">
              <h2 className="text-xl font-bold text-blue-800 mb-4">
                REGISTRATION FORM
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "팀 깃랩 코드", name: "teamGitlabCode" },
                  { label: "팀 명", name: "teamName" },
                  { label: "팀 구성원", name: "teamMembers" },
                  { label: "프로젝트 명", name: "projectName" },
                  { label: "피그마 링크", name: "figmaLink" },
                  { label: "지라 링크", name: "jiraLink" },
                ].map((field) => (
                  <React.Fragment key={field.name}>
                    <div className="col-span-1 flex items-center">
                      {field.label}
                    </div>
                    <div className="col-span-2">
                      <input
                        className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
                        // placeholder={field.label}
                        value={fieldValues[field.name]}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                      />
                    </div>
                  </React.Fragment>
                ))}
                <div className="col-span-1 flex items-center">팀원 정보</div>
                <div className="col-span-2">
                  <textarea
                    className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md resize-none"
                    placeholder="팀원 정보 및 관심사 등을 입력해주세요!"
                    rows={4}
                    value={fieldValues.teamInfo}
                    onChange={(e) => handleChange("teamInfo", e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-end px-8 mb-8">
              <DefaultButton
                onClick={() => {
                  deleteProject(projectId);
                  navigate("/projectlist");
                }}
                className=""
                theme="alert"
                text={"프로젝트 삭제"}
              />
            </div>
            <div className="bg-blue-900 text-white p-8"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectEssentialPage;
