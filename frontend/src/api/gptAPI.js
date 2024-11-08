import axios from "axios";

const GPT_API_URL = "https://api.openai.com/v1/chat/completions";

const gptApi = axios.create({
  baseURL: GPT_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  },
});

/**
 * Sends a message to the GPT API and retrieves the response.
 * @param {Array} messages - Array of message objects with 'role' and 'content'.
 * @returns {Promise<string>} - The response message from GPT.
 */
export const sendMessageToGPT = async (messages) => {
  try {
    const response = await gptApi.post("", {
      model: "gpt-4", // 또는 사용하고자 하는 모델로 변경
      messages: messages,
    });

    const gptMessage = response.data.choices[0].message.content.trim();
    return gptMessage;
  } catch (error) {
    console.error("Error communicating with GPT API:", error);
    throw error;
  }
};
