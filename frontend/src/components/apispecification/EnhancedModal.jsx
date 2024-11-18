import React from "react";
import MarkdownEditor from "./MarkdownEditor";

const EnhancedModal = ({
  isOpen,
  onClose,
  selectedSpec,
  formData,
  onSubmit,
  handleLiveChange, // Liveblocks 데이터 변경 함수
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-gray-100 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* 모달 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold">
            API 명세 수정 - {selectedSpec?.feature}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 모달 바디 */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URI
            </label>
            <input
              type="text"
              name="uri"
              value={formData.uri || ""}
              onChange={(e) => handleLiveChange("uri", e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Markdown 필드 */}
          <MarkdownEditor
            label="Request Header"
            name="requestHeader"
            value={formData.requestHeader || ""}
            onChange={(value) => handleLiveChange("requestHeader", value)}
          />
          <MarkdownEditor
            label="Request Params"
            name="requestParams"
            value={formData.requestParams || ""}
            onChange={(value) => handleLiveChange("requestParams", value)}
          />
          <MarkdownEditor
            label="Request Body"
            name="requestBody"
            value={formData.requestBody || ""}
            onChange={(value) => handleLiveChange("requestBody", value)}
          />
          <MarkdownEditor
            label="Response Body"
            name="responseBody"
            value={formData.responseBody || ""}
            onChange={(value) => handleLiveChange("responseBody", value)}
          />
        </div>

        {/* 모달 푸터 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedModal;
