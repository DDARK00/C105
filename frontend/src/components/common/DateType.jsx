function DateType({ dateString }) {
  const date = new Date(dateString);

  // 연도, 월, 일, 시간, 분 추출 후 두 자리로 맞춤
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const str = `${year}-${month}-${day} ${hours}:${minutes}`;

  // 사용 예시
  // "Sun, 10 Nov 2024 10:49:00 +0900" // 2024-11-10 10:49

  return (
    <>
      <span className="text-xs text-gray-500">{str}</span>
    </>
  );
}

export default DateType;
