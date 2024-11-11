// 문서 유형 상수
export const DOCUMENT_TYPES = {
  PROPOSAL: 'proposal',
  REQUIREMENTS: 'requirementsspecification',
  API_SPEC: 'apispecification',
  ERD: 'erd',
  FLOWCHART: 'flowchart'
};

// API 엔드포인트 매핑
export const API_ENDPOINTS = {
  [DOCUMENT_TYPES.PROPOSAL]: (ideaId) => `/api/v1/planner/${ideaId}`,
  [DOCUMENT_TYPES.REQUIREMENTS]: (ideaId) => `/api/v1/req/${ideaId}`,
  [DOCUMENT_TYPES.API_SPEC]: (ideaId) => `/api/v1/api-docs/${ideaId}`,
  [DOCUMENT_TYPES.ERD]: (ideaId) => `/api/v1/erd/${ideaId}`,
  [DOCUMENT_TYPES.FLOWCHART]: (ideaId) => `/api/v1/flowchart/${ideaId}`,
}; 