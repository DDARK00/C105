import React, { useEffect, useState } from "react";
import DefaultButton from "../common/DefaultButton";
import {
  selectIdea,
  unselectIdea,
  createIdeaComment,
  fetchIdeaDetail,
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

  const handleChange = (value) => {
    setCommentInput(value);
  };

  const handleSelectIdea = async () => {
    if (selectedSticker) {
      const success = await selectIdea(selectedSticker.ideaId);
      if (success) {
        alert("아이디어가 성공적으로 채택되었습니다.");
      } else {
        alert("아이디어 채택에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    const stickerDetail = async () => {
      try {
        const result = await fetchIdeaDetail(param?.id, selectedSticker.ideaId);
        setComments(result.comments || []);
      } catch (error) {
        console.error("Error fetching sticker detail:", error);
      }
    };

    stickerDetail(); // 함수 호출
  }, [selectedSticker.ideaId, param]);

  const handleUnSelectIdea = async () => {
    if (selectedSticker) {
      const success = await unselectIdea(selectedSticker.ideaId);
      if (success) {
        alert("아이디어가 성공적으로 채택되었습니다.");
      } else {
        alert("아이디어 채택에 실패했습니다.");
      }
    }
  };

  const seviceName = { label: "서비스 명", name: "serviceName" };
  const inputDatas = [
    { label: "기획 배경", name: "background" },
    { label: "서비스 소개", name: "introduction" },
    { label: "서비스 타켓", name: "target" },
    { label: "기대 효과", name: "expectedEffect" },
    { label: "주제 추천", name: "projectTopic" },
    { label: "추천 기술 스택", name: "techStack" },
    { label: "고급 기술 스택", name: "advancedStack" },
  ];

  const handleSend = async () => {
    if (commentInput.trim() === "") {
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

  return (
    <div className="flex flex-row h-full">
      {/* 왼쪽 정보 섹션 */}
      <div className="flex-1 p-6 h-full border-black border-r-[1px] space-y-4 overflow-auto">
        <div className="grid grid-cols-4 gap-10">
          <div className="col-span-1 flex items-center">{seviceName.label}</div>
          <div className="col-span-3">
            <input
              type="text"
              name={seviceName.name}
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              placeholder={`${seviceName.label}을 입력해주세요`}
              value={selectedSticker?.[seviceName.name] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
          {inputDatas.map((field) => (
            <React.Fragment key={field.name}>
              <div className="col-span-1 flex items-center">{field.label}</div>
              <div className="col-span-3">
                <textarea
                  name={field.name}
                  className="w-full min-h-28 bg-gray-100 border border-gray-300 p-2 rounded-md"
                  placeholder={`${field.label}을 입력해주세요`}
                  value={selectedSticker?.[field.name] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
        {mainIdea === selectedSticker.ideaId
          ? leader === userInfo.username && (
              <div className="flex flex-1 justify-end pr-2 mb-8">
                <DefaultButton
                  onClick={handleUnSelectIdea}
                  className=""
                  theme="bright"
                  text={"아이디어 채택 취소"}
                />
              </div>
            )
          : leader === userInfo.username && (
              <div className="flex flex-1 justify-end pr-2 mb-8">
                <DefaultButton
                  onClick={handleSelectIdea}
                  className=""
                  theme="bright"
                  text={"아이디어 채택"}
                />
              </div>
            )}
      </div>

      {/* 오른쪽 댓글 섹션 */}
      <div className="flex-1 p-6 h-full flex flex-col">
        <p className="text-lg font-semibold mb-4 ml-4">댓글</p>

        {/* 댓글 작성 인풋 박스 */}
        <div className="flex border-t border-gray-300 p-3 items-center space-x-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => handleChange(e.target.value)}
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
        <div className="space-y-4">
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
                    <p className="text-sm text-gray-500">
                      {formattedDate}
                    </p>{" "}
                    {/* 변환된 날짜 표시 */}
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
