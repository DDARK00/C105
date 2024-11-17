import { useState } from "react";
import { updateUserInfo } from "../../api/axios";
import { useUserStore } from "../../store/useUserStore";
import { NOW_MAX_GRADE, SSAFY_LOCATION } from "../../global";
import useGlobalLoadingStore from "../../store/useGlobalLoadingStore";

const UpdateUser = () => {
  const { startLoading, stopLoading } = useGlobalLoadingStore();
  const { setUserInfo } = useUserStore();
  const [userProfile, setUserProfile] = useState({
    name: "",
    locationType: "",
    grade: "",
  });

  // input, select 변경 시 호출되는 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // select 요소 변경
  const handleSelectChange = (e) => {
    const selectedname = e.target.name;
    const selectedValue = e.target.value;
    setUserProfile((prevData) => ({
      ...prevData,
      [selectedname]: selectedValue,
    }));
  };

  // 수정하기 버튼 클릭 시 호출되는 함수
  const handleButtonClick = async () => {
    console.log(userProfile);
    startLoading();
    const data = await updateUserInfo(userProfile);
    if (data) {
      console.log(":?");
      setUserInfo(data);
      stopLoading();
      window.location.reload();
    } else {
      window.alert("유저 정보 수정에 실패했습니다. " + data?.message);
      stopLoading();
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col items-center justify-between min-h-full space-y-4 w-full">
      <h2 className="text-lg font-semibold">유저 정보 입력</h2>
      <hr className="w-full border-gray-300 my-2" />

      <div className="w-full space-y-4">
        <label className="flex flex-col text-left w-full">
          이름 :
          <input
            type="text"
            placeholder="이름을 입력하세요."
            name="name"
            value={userProfile.name}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded w-full text-gray-700 bg-gray-50"
          />
        </label>

        <label className="flex flex-col text-left w-full">
          지역 :
          <select
            name="locationType"
            value={userProfile.locationType}
            onChange={handleSelectChange}
            className="mt-1 p-2 border rounded w-full text-gray-700 bg-gray-50"
          >
            <option value="" disabled>
              지역를 선택하세요
            </option>
            {SSAFY_LOCATION.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-left w-full">
          기수 :
          <select
            name="grade"
            value={userProfile.grade}
            onChange={handleSelectChange}
            className="mt-1 p-2 border rounded w-full text-gray-700 bg-gray-50"
          >
            <option value="" disabled>
              기수를 선택하세요
            </option>
            {[
              ...Array.from(
                { length: NOW_MAX_GRADE },
                (_, i) => NOW_MAX_GRADE - i
              ),
            ].map((grade, index) => (
              <option key={index} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="px-6 py-3 bg-gray-200 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-300 transition text-lg w-full"
        onClick={handleButtonClick}
      >
        수정하기
      </button>
    </div>
  );
};

export default UpdateUser;
