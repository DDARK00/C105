import { createIdea } from "../../api/axios";
import { colors, darkColors, animations } from "../ideaboard/variable";

/**
 * 랜덤 스티커 데이터 생성 함수
 * @returns {Object} 랜덤 스티커 데이터
 */
const generateRandomStickerData = () => {
  const x = Math.floor(Math.random() * 85 + 0); // x 범위 0% ~ 86%
  const y = Math.floor(Math.random() * 67 + 5); // y 범위 5% ~ 71%

  const index = Math.floor(Math.random() * colors.length);
  const color = colors[index];
  const darkColor = darkColors[index];
  const animation = animations[Math.floor(Math.random() * animations.length)];

  return { x, y, color, darkColor, animation };
};

async function handleGenerateStickerFromAI(projectId, aiDraftData) {
  try {
    // AI 초안 데이터에서 필요한 7개 필드 추출
    const {
      background,
      service_intro,
      target_users,
      expected_effects,
      project_topics,
      tech_stack,
      advanced_stack,
    } = aiDraftData;

    // 랜덤 데이터를 생성
    const randomData = generateRandomStickerData();

    // 자동 생성 필드와 함께 최종 스티커 데이터 구성
    const stickerData = {
      serviceName: service_intro || "기본 서비스 명",
      background: background || "기본 기획 배경",
      introduction: service_intro || "기본 서비스 소개",
      target: target_users || "기본 타겟",
      expectedEffect: expected_effects || "기본 기대 효과",
      projectTopic: project_topics || "기본 주제 추천",
      techStack: tech_stack || "기본 기술 스택",
      advancedStack: advanced_stack || "기본 고급 기술 스택",
      ...randomData, // 랜덤 데이터 병합
    };

    // API 호출로 스티커 생성 요청
    const response = await createIdea(projectId, stickerData);

    if (response) {
      alert("스티커가 성공적으로 생성되었습니다!");
    } else {
      alert("스티커 생성에 실패했습니다. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error("스티커 생성 중 오류 발생:", error);
    alert("스티커 생성 중 오류가 발생했습니다.");
  }
}

export default handleGenerateStickerFromAI;
