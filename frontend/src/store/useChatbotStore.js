import { create } from "zustand";

const useChatbotStore = create((set) => ({
  messages: [
    {
      role: "system",
      content: "안녕하세요! 무엇을 도와드릴까요?",
    },
  ],
  addUserMessage: (content) =>
    set((state) => ({
      messages: [...state.messages, { role: "user", content }],
    })),
  addGPTMessage: (content) =>
    set((state) => ({
      messages: [...state.messages, { role: "assistant", content }],
    })),
  clearMessages: () =>
    set(() => ({
      messages: [
        {
          role: "system",
          content: "안녕하세요! 무엇을 도와드릴까요?",
        },
      ],
    })),
}));

export default useChatbotStore;
