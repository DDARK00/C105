import React, { useState } from "react";
import DefaultButton from "../common/DefaultButton";
import { generatePlan } from "../../api/aiPlan";
import { useNavigate } from "react-router-dom";
import handleGenerateStickerFromAI from "../ideaboard/handleGenerateStickerFromAI";

const AIPlanForm = ({ onClose, projectId }) => {
  const navigate = useNavigate();

  const [tags, setTags] = useState({
    기획배경: [],
    서비스소개: [],
    타겟유저: [],
    기대효과: [],
  });
  const [inputs, setInputs] = useState({
    기획배경: "",
    서비스소개: "",
    타겟유저: "",
    기대효과: "",
  });

  const [generatedPlan, setGeneratedPlan] = useState({
    background: "",
    service_intro: "",
    target_users: "",
    expected_effects: "",
    project_topics: "",
    tech_stack: "",
    advanced_stack: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event, key) => {
    setInputs({ ...inputs, [key]: event.target.value });
  };

  const handleKeyDown = (event, key) => {
    if (event.key === "Enter" && inputs[key]) {
      event.preventDefault();
      if (tags[key].includes(inputs[key])) return;
      setTags({
        ...tags,
        [key]: [...tags[key], inputs[key]],
      });
      setInputs({ ...inputs, [key]: "" });
    }
  };

  const handleRemoveTag = (key, tagToRemove) => {
    setTags({
      ...tags,
      [key]: tags[key].filter((tag) => tag !== tagToRemove),
    });
  };

  const handleGeneratedPlanChange = (event, key) => {
    setGeneratedPlan({
      ...generatedPlan,
      [key]: event.target.value,
    });
  };

  const generatePlanHandler = async () => {
    if (
      !generatedPlan.background ||
      !generatedPlan.service_intro ||
      !generatedPlan.target_users ||
      !generatedPlan.expected_effects ||
      !generatedPlan.project_topics ||
      !generatedPlan.tech_stack ||
      !generatedPlan.advanced_stack
    ) {
      alert("값을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsCompleted(false);
    try {
      const plan = await generatePlan(tags);
      setGeneratedPlan({
        background: plan.background,
        service_intro: plan.introduction,
        target_users: plan.target,
        expected_effects: plan.expectedEffect,
        project_topics: plan.projectTopic,
        tech_stack: plan.techStack,
        advanced_stack: plan.advancedStack,
      });
      setIsCompleted(true);
      setTimeout(() => setIsCompleted(false), 3000);
    } catch (err) {
      setError("기획서 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToIdeaBoard = async () => {
    // check the all of generatedPlan status
    if (
      !generatedPlan.background ||
      !generatedPlan.service_intro ||
      !generatedPlan.target_users ||
      !generatedPlan.expected_effects ||
      !generatedPlan.project_topics ||
      !generatedPlan.tech_stack ||
      !generatedPlan.advanced_stack
    ) {
      alert("값을 입력해주세요.");
      return;
    }

    try {
      // 초안 데이터를 기반으로 스티커 생성
      // console.log("아이디어 보드로 이동합니다!", projectId, generatedPlan);
      await handleGenerateStickerFromAI(projectId, generatedPlan);
      alert("아이디어 보드로 이동합니다!");
      // 아이디어 보드 페이지로 이동
      navigate(`/project/${projectId}/ideaboard`);
    } catch (error) {
      // console.error("아이디어 보드 이동 중 오류:", error);
      alert("아이디어 보드로 이동할 수 없습니다. 다시 시도해주세요.");
    } finally {
      onClose();
    }
  };

  return (
    <div className="flex flex-col max-w-3xl mx-auto h-full border border-gray-300 rounded-lg shadow-lg">
      <div className="bg-blue-900 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">AI 기획서 초안</h1>
        <p className="text-sm">AI Project Plan Draft</p>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
        <div className="space-y-4">
          {Object.keys(tags).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">{key}</label>
              <input
                type="text"
                placeholder={`${key} 키워드를 추가해주세요.`}
                value={inputs[key]}
                onChange={(e) => handleInputChange(e, key)}
                onKeyDown={(e) => handleKeyDown(e, key)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap mt-2">
                {tags[key].map((tag, index) => (
                  <span
                    key={index}
                    className="mr-2 mb-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(key, tag)}
                      className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                      aria-label={`Remove ${tag}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`space-y-4 ${
            isLoading ? "flex items-center justify-center" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="loader mb-2"></div>
              <p className="text-gray-700">기획서를 생성 중입니다...</p>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {[
                { key: "background", label: "기획 배경" },
                { key: "service_intro", label: "서비스 소개" },
                { key: "target_users", label: "타겟 유저" },
                { key: "expected_effects", label: "기대효과" },
                { key: "project_topics", label: "주제 추천" },
                { key: "tech_stack", label: "기술스택 추천" },
                { key: "advanced_stack", label: "도전적인 기술스택 추천" },
              ].map(({ key, label }, index) => (
                <div key={index}>
                  <label className="text-gray-700 font-medium mb-1">
                    {label}
                  </label>
                  <textarea
                    value={generatedPlan[key]}
                    onChange={(e) => handleGeneratedPlanChange(e, key)}
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder={`AI가 작성한 ${label}의 내용이 표시됩니다.`}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center p-6">
        <DefaultButton onClick={onClose} text="닫기" />
        <div className="flex space-x-4">
          <DefaultButton
            text={
              isLoading ? (
                <span className="flex items-center">
                  <span className="loader mr-2"></span> 생성 중...
                </span>
              ) : (
                "기획서 생성"
              )
            }
            onClick={generatePlanHandler}
            type="button"
            disabled={isLoading}
          />
          <DefaultButton onClick={goToIdeaBoard} text="아이디어 보드" />
        </div>
      </div>

      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIPlanForm;
