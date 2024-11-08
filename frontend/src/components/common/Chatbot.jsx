import React, { useState } from "react";
import useChatbotStore from "../../store/useChatbotStore";
import { sendMessageToGPT } from "../../api/gptApi";
import "./Chatbot.css";

const Chatbot = () => {
  const { messages, addUserMessage, addGPTMessage, clearMessages } =
    useChatbotStore();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message
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
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>챗봇</span>
            <button className="chatbot-close-button" onClick={toggleChatbot}>
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${
                  msg.role === "user" ? "user-message" : "gpt-message"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message gpt-message">
                응답을 작성 중입니다...
              </div>
            )}
          </div>
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
            />
            <button onClick={handleSend}>전송</button>
          </div>
          <div className="chatbot-footer">
            <button onClick={clearMessages}>대화 초기화</button>
          </div>
        </div>
      )}
      <button className="chatbot-toggle-button" onClick={toggleChatbot}>
        💬
      </button>
    </div>
  );
};

export default Chatbot;
