function CarouselItemSkeleton() {
  return (
    <div
      // key={index}
      className="w-full rounded-md flex-shrink-0 bg-slate-200 p-4 animate-pulse"
    >
      <div className="bg-overlay py-3 px-2 w-full grid grid-cols-1 items-center">
        {/* 스켈레톤 제목 부분 */}
        <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-2" />
        <p className="text-gray-400">데이터 로딩 중...</p>
        {/* 스켈레톤 설명 부분 (여러 줄로 구성) */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded-md w-full" />
          <div className="h-4 bg-gray-300 rounded-md w-5/6" />
          <div className="h-4 bg-gray-300 rounded-md w-4/5" />
        </div>
      </div>
    </div>
  );
}

export default CarouselItemSkeleton;
