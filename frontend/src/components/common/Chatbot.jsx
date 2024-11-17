import React, { useState, useEffect } from "react";
import useChatbotStore from "../../store/useChatbotStore";
import { sendMessageToGPT } from "../../api/gptAPI";

const Chatbot = () => {
  const { messages, addUserMessage, addGPTMessage, clearMessages } =
    useChatbotStore();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // 실제 렌더링 여부를 관리할 상태
  const [isLoading, setIsLoading] = useState(false);

  const toggleChatbot = () => {
    if (isOpen) {
      setIsOpen(false); // 애니메이션 적용
      setTimeout(() => setIsVisible(false), 500); // 닫힘 애니메이션 완료 후 컴포넌트 제거
    } else {
      setIsVisible(true); // 컴포넌트를 먼저 렌더링
      setTimeout(() => setIsOpen(true), 10); // 애니메이션 시작
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    addUserMessage(input);
    setInput("");
    setIsLoading(true);

    try {
      const gptResponse = await sendMessageToGPT(
        messages.concat([{ role: "user", content: input }])
      );
      addGPTMessage(gptResponse);
    } catch (error) {
      addGPTMessage("죄송합니다. 응답을 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isVisible && (
        <div
          className={`transition-all duration-500 transform ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-96 h-[500px] bg-white border border-gray-300 rounded-lg flex flex-col shadow-2xl">
            {/* 헤더 */}
            <div className="flex justify-between items-center bg-indigo-600 text-white p-4 rounded-t-lg">
              <span className="font-semibold text-lg">
                무엇이든 물어보세요.
              </span>
              <button onClick={toggleChatbot} className="text-2xl font-bold">
                ×
              </button>
            </div>

            {/* 메시지 */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded-lg max-w-full break-words ${
                    msg.role === "user"
                      ? "bg-indigo-500 text-white self-end"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                  응답을 작성 중입니다...잠시만 기다려주세요...
                </div>
              )}
            </div>

            {/* 입력 영역 */}
            <div className="flex border-t border-gray-300 p-3 bg-gray-50 items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none h-10"
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none h-10 text-xs"
              >
                전송
              </button>
              <button
                onClick={clearMessages}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none h-10 text-xs"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="bg-indigo-600 text-sm text-white rounded-full w-40 h-12 flex items-center justify-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 fixed bottom-6 right-6 shadow-md"
        >
          GPT에게 물어보기
        </button>
      )}
    </div>
  );
};

export default Chatbot;
