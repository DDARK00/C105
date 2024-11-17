import axios from "axios";

const API_URL = "https://k11c105.p.ssafy.io/api/v1/search/ai-planner";

/**
 * 사용자가 입력한 키워드를 백엔드 API로 전송하여 기획서를 생성합니다.
 * @param {Object} tags - 섹션별로 분류된 키워드.
 * @returns {Object} - 생성된 기획서.
 * @throws API 요청이 실패할 경우 에러를 던집니다.
 */
export const generatePlan = async (tags) => {
  // 프론트엔드의 한국어 키를 백엔드가 기대하는 영어 키로 매핑
  const payload = {
    background: tags["기획배경"],
    service_intro: tags["서비스소개"],
    target_users: tags["타겟유저"],
    expected_effects: tags["기대효과"],
  };

  try {
    const response = await axios.post(API_URL, payload);
    return response.data.data; // 백엔드의 응답 구조에 맞게 조정
  } catch (error) {
    console.error("기획서 생성 중 오류 발생:", error);
    throw error;
  }
};
