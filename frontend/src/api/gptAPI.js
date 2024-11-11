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

const faqCache = {
  "플로우차트는 어떻게 생성함?":
    "https://velog.io/@junho5336/Mermaid-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%84%9C-%EC%84%A4%EA%B3%84%ED%95%98%EA%B8%B0 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "플로우차트는 어떻게 생성하나요?":
    "https://velog.io/@junho5336/Mermaid-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%84%9C-%EC%84%A4%EA%B3%84%ED%95%98%EA%B8%B0 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "플로우차트는 어떻게 생성해?":
    "https://velog.io/@junho5336/Mermaid-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%84%9C-%EC%84%A4%EA%B3%84%ED%95%98%EA%B8%B0 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "플로우차트는 어떻게 함?":
    "https://velog.io/@junho5336/Mermaid-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%84%9C-%EC%84%A4%EA%B3%84%ED%95%98%EA%B8%B0 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "플로우차트는 어떻게 만들어?":
    "https://velog.io/@junho5336/Mermaid-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%84%9C-%EC%84%A4%EA%B3%84%ED%95%98%EA%B8%B0 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "플로우차트는 어떻게 하면 돼?.":
    "https://velog.io/@junho5336/Mermaid-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%84%9C-%EC%84%A4%EA%B3%84%ED%95%98%EA%B8%B0 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "ERD는 어떻게 생성함?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "ERD는 어떻게 생성하나요?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "ERD는 어떻게 생성해?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "ERD는 어떻게 함?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "ERD는 어떻게 만들어?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "ERD는 어떻게 하면 돼?.":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "이알디는 어떻게 생성함?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "이알디는 어떻게 생성하나요?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "이알디는 어떻게 생성해?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "이알디는 어떻게 함?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "이알디는 어떻게 만들어?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "이알디는 어떻게 하면 돼?.":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "다이어그램은 어떻게 생성함?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "다이어그램은 어떻게 생성하나요?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "다이어그램은 어떻게 생성해?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "다이어그램은 어떻게 함?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "다이어그램은 어떻게 만들어?":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
  "다이어그램은 어떻게 하면 돼?.":
    "https://wogus789789.tistory.com/292 해당 링크에 방문하면 보다 쉽게 사용할 수 있습니다.",
};

export const sendMessageToGPT = async (messages) => {
  const lastMessage = messages[messages.length - 1].content;

  // 자주 묻는 질문 캐싱 확인
  if (faqCache[lastMessage]) {
    return faqCache[lastMessage];
  }

  try {
    const response = await gptApi.post("", {
      model: "gpt-3.5-turbo", // 또는 사용하고자 하는 모델로 변경
      messages: messages,
    });

    const gptMessage = response.data.choices[0].message.content.trim();
    return gptMessage;
  } catch (error) {
    console.error("Error communicating with GPT API:", error);
    addGPTMessage(
      "죄송합니다. 응답을 가져오는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요."
    );
  }
};
