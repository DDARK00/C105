import { Link } from "react-router-dom"; // 홈으로 돌아가는 링크를 위해 추가

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      {/* 이모티콘과 텍스트로 페이지가 없음을 강조 */}
      <div className="text-6xl mb-4">😢</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 mb-8">요청하신 페이지를 찾을 수 없습니다.</p>

      {/* 홈으로 돌아가는 버튼 */}
      <Link
        to="/"
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default NotFoundPage;
