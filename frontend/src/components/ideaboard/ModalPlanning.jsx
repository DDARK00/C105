import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import DefaultButton from "../common/DefaultButton";
import {
  selectIdea,
  unselectIdea,
  createIdeaComment,
  fetchIdeaDetail,
  updateIdea, // 추가된 updateIdea 함수
} from "../../api/axios";
import { useUserStore } from "../../store/useUserStore";
import useProjectStore from "../../store/useProjectStore";
import { useParams } from "react-router-dom";
import Divier from "../common/Divier";

const ModalPlanning = ({ selectedSticker }) => {
  const param = useParams();
  const { userInfo } = useUserStore();
  const { leader, mainIdea, members } = useProjectStore();
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  // 왼쪽 정보 섹션을 위한 상태 추가
  const [formData, setFormData] = useState({
    serviceName: "",
    background: "",
    introduction: "",
    target: "",
    expectedEffect: "",
    projectTopic: "",
    techStack: "",
    advancedStack: "",
  });

  // `textarea` 자동 높이 조절을 위한 refs
  const textareaRefs = {
    background: useRef(null),
    introduction: useRef(null),
    target: useRef(null),
    expectedEffect: useRef(null),
    projectTopic: useRef(null),
    techStack: useRef(null),
    advancedStack: useRef(null),
  };

  // `stickerDetail` 함수를 컴포넌트 외부에 정의하여 재사용 가능하게 함
  const stickerDetail = async () => {
    try {
      const result = await fetchIdeaDetail(param?.id, selectedSticker.ideaId);
      setComments(result.comments || []);
      setFormData({
        serviceName: result.serviceName || "",
        background: result.background || "",
        introduction: result.introduction || "",
        target: result.target || "",
        expectedEffect: result.expectedEffect || "",
        projectTopic: result.projectTopic || "",
        techStack: result.techStack || "",
        advancedStack: result.advancedStack || "",
      });
    } catch (error) {
      console.error("Error fetching sticker detail:", error);
    }
  };

  // `formData` 초기화
  useEffect(() => {
    if (selectedSticker) {
      stickerDetail();
    }
  }, [selectedSticker, param]);

  // `formData` 변경 핸들러
  const handleFormChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  // 댓글 입력 핸들러
  const handleCommentChange = (e) => {
    console.log(e.target.value);
    setCommentInput(e.target.value);
  };

  const handleSelectIdea = async () => {
    if (selectedSticker) {
      const success = await selectIdea(selectedSticker.ideaId);
      if (success) {
        alert("아이디어가 성공적으로 채택되었습니다.");
        // 필요 시, 추가적인 로직을 여기에 작성
        useProjectStore.setState({ mainIdea: selectedSticker });
      } else {
        alert("아이디어 채택에 실패했습니다.");
      }
    }
  };

  const handleUnSelectIdea = async () => {
    if (selectedSticker) {
      const success = await unselectIdea(selectedSticker.ideaId);
      if (success) {
        alert("아이디어 채택이 성공적으로 취소되었습니다.");
        // 필요 시, 추가적인 로직을 여기에 작성
        useProjectStore.setState({ mainIdea: null });
      } else {
        alert("아이디어 채택 취소에 실패했습니다.");
      }
    }
  };

  const handleSend = async () => {
    // 공백만 입력된 경우 체크
    if (!commentInput.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    const payload = {
      commentContent: commentInput,
      rating: 0, // 평점을 항상 0으로 설정
    };

    const success = await createIdeaComment(selectedSticker.ideaId, payload);
    if (success) {
      // 댓글이 성공적으로 작성되었으면 목록 업데이트
      setComments([...comments, payload]);
      setCommentInput(""); // 입력 필드 초기화
    } else {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleUpdateIdea = async () => {
    try {
      const updatedData = {
        serviceName: formData.serviceName,
        background: formData.background,
        introduction: formData.introduction,
        target: formData.target,
        expectedEffect: formData.expectedEffect,
        projectTopic: formData.projectTopic,
        techStack: formData.techStack,
        advancedStack: formData.advancedStack,
        // 추가적으로 필요한 필드가 있다면 여기에 포함
        x: selectedSticker.x,
        y: selectedSticker.y,
        color: selectedSticker.color,
        darkColor: selectedSticker.darkColor,
        animation: selectedSticker.animation,
      };
      console.log("Updating idea with data:", updatedData); // 디버깅용 로그
      const result = await updateIdea(selectedSticker.ideaId, updatedData);
      console.log("Update idea result:", result); // 디버깅용 로그
      if (result) {
        alert("아이디어가 성공적으로 업데이트되었습니다.");
        // 업데이트 후 다시 데이터를 불러와서 UI를 즉시 반영
        await stickerDetail();
      } else {
        alert("아이디어 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating idea:", error);
      alert("아이디어 업데이트 중 오류가 발생했습니다.");
    }
  };

  // 자동 높이 조절 함수
  const autoResizeTextarea = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto"; // 기존 높이 초기화
      ref.current.style.height = `${ref.current.scrollHeight}px`; // 새로운 높이 설정
    }
  };

  // `formData`가 변경될 때마다 `textarea`의 높이 조절
  useLayoutEffect(() => {
    Object.values(textareaRefs).forEach((ref) => {
      autoResizeTextarea(ref);
    });
  }, [formData]);

  // 올바르게 정의된 `serviceName`과 `inputDatas`
  const serviceName = { label: "서비스 명", name: "serviceName" };
  const inputDatas = [
    { label: "기획 배경", name: "background" },
    { label: "서비스 소개", name: "introduction" },
    { label: "서비스 타겟", name: "target" },
    { label: "기대 효과", name: "expectedEffect" },
    { label: "주제 추천", name: "projectTopic" },
    { label: "추천 기술 스택", name: "techStack" },
    { label: "고급 기술 스택", name: "advancedStack" },
  ];

  return (
    <div className="flex flex-row h-full">
      {/* 왼쪽 정보 섹션 */}
      <div className="flex-1 p-6 h-full border-black border-r-[1px] space-y-4 overflow-auto">
        <div className="grid grid-cols-4 gap-10">
          <div className="col-span-1 flex items-center">
            {serviceName.label}
          </div>
          <div className="col-span-3">
            <input
              type="text"
              name={serviceName.name}
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              placeholder={`${serviceName.label}을 입력해주세요`}
              value={formData.serviceName}
              onChange={(e) => handleFormChange(e, serviceName.name)}
            />
          </div>
          {inputDatas.map((field) => (
            <React.Fragment key={field.name}>
              <div className="col-span-1 flex items-center">{field.label}</div>
              <div className="col-span-3">
                <textarea
                  name={field.name}
                  ref={textareaRefs[field.name]}
                  className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md overflow-hidden"
                  placeholder={`${field.label}을 입력해주세요`}
                  value={formData[field.name]}
                  onChange={(e) => handleFormChange(e, field.name)}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
        {/* "수정" 버튼 추가 */}
        <div className="flex flex-1 justify-end pr-2 mt-4">
          <DefaultButton
            onClick={handleUpdateIdea}
            className="mr-4"
            theme="bright"
            text={"수정"}
          />
          {mainIdea?.ideaId === selectedSticker.ideaId &&
            leader === userInfo.username && (
              <DefaultButton
                onClick={handleUnSelectIdea}
                className=""
                theme="bright"
                text={"아이디어 채택 취소"}
              />
            )}
          {mainIdea?.ideaId === null && leader === userInfo.username && (
            <DefaultButton
              onClick={handleSelectIdea}
              className=""
              theme="bright"
              text={"아이디어 채택"}
            />
          )}
        </div>
      </div>

      {/* 오른쪽 댓글 섹션 */}
      <div className="flex-1 p-6 h-full flex flex-col">
        <p className="text-lg font-semibold mb-4 ml-4">댓글</p>

        {/* 댓글 작성 인풋 박스 */}
        <div className="flex border-t border-gray-300 p-3 items-center space-x-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => handleCommentChange(e)}
            placeholder="댓글을 입력해주세요"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none h-10"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 focus:outline-none h-10 text-xs"
          >
            작성
          </button>
        </div>
        {/* 댓글 리스트 */}
        <div className="space-y-4 mt-4">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => {
              // createdAt을 "YYYY.MM.DD" 형식으로 변환
              const formattedDate = comment.createdAt
                ? new Date(comment.createdAt)
                    .toISOString()
                    .split("T")[0]
                    .replace(/-/g, ".")
                : new Date().toISOString().split("T")[0].replace(/-/g, ".");

              const commenterName =
                members.find((member) => member.id === comment.userId)?.name ||
                userInfo.name;
              return (
                <div
                  key={index}
                  className="p-2 mx-3 border border-gray-300 rounded-md transition-all animate-tinRightIn"
                  style={{ backgroundColor: selectedSticker.darkColor }}
                >
                  <div className="flex justify-between items-center">
                    <p className="ml-2 font-semibold">{commenterName}</p>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                  </div>
                  <Divier />
                  <p className="ml-2 py-2">{comment.commentContent}</p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center mt-10">
              작성된 댓글이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalPlanning;
