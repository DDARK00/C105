import { Helmet } from "react-helmet-async";
import MindMap from "../../components/brainstorming/MindMap";
import { useCallback, useEffect, useState } from "react";
import { mindMapColorData } from "../../dummy/brainstorming";
import AIPlanForm from "../../components/brainstorming/AIPlanForm";
import PortalModal from "../../components/common/PortalModal";
import DefaultButton from "../../components/common/DefaultButton";
import {
  createMindMap,
  fetchAllGenGithubPJTtoKeyword,
  fetchMindMap,
  fetchMindMapSubKeyword,
  fetchNewstoKeyword,
} from "../../api/axios";
import { CreateMindMapData } from "../../utils/mindMapUtils";
import { useParams } from "react-router-dom";
import CloudOverlay from "../../components/brainstorming/CloudOverlay";
import SearchBar from "../../components/brainstorming/SearchBar";
import NotYetSearchText from "../../components/brainstorming/NoSearchText";
import GithubCarousel from "../../components/brainstorming/GithubCarousel";
import NewsCarousel from "../../components/brainstorming/NewsCarousel";

function MindMapPage() {
  const params = useParams();
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  // const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [newsIndex, setNewsIndex] = useState(0); // 현재 뉴스 인덱스
  const [githubIndex, setGithubIndex] = useState(0); // 현재 GitHub 링크 인덱스
  const [mindMapData, setMindMapData] = useState({
    nodes: [],
    links: [],
  });

  const [githubDatas, setGithubdatas] = useState([]);
  const [newsDatas, setNewsdatas] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    // 스크롤 애니메이션 효과
    if (selectedDetail) {
      const detailElement = document.getElementById(
        `detail-${selectedDetail.id}`
      );
      if (detailElement) {
        detailElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedDetail]);

  useEffect(() => {
    const init = async () => {
      const response = await fetchMindMap(params?.id);
      if (response) {
        // 이미 생성된 마인드맵이 있으면
        const { mainKeyword, keywords } = response;
        const words = keywords.map((item) => item.content);
        const { nodes: newNodes, links: newLinks } = CreateMindMapData(
          mainKeyword,
          words
        );

        setMindMapData({
          nodes: newNodes,
          links: newLinks,
        });
      }
    };
    if (params.id === undefined) return;
    init();
  }, [params.id]);

  // 마인드맵 검색
  const handleSearch = async () => {
    const keyword = searchKeyword.trim();
    if (!keyword) {
      alert("검색어를 입력해주세요.");
      return;
    }

    // 마인드맵 작성
    const SubKeywords = await fetchMindMapSubKeyword(keyword);
    if (Array.isArray(SubKeywords)) {
      const { nodes: newNodes, links: newLinks } = CreateMindMapData(
        searchKeyword,
        SubKeywords
      );

      // 저장
      createMindMap({
        projectId: params?.id,
        mainKeyword: searchKeyword,
        keywords: SubKeywords,
      });

      // 세팅
      setMindMapData({
        nodes: newNodes,
        links: newLinks,
      });
    } else {
      alert("서버 에러");
    }

    setSelectedDetail(null);
  };

  const handleDetailClick = async (detail) => {
    if (selectedDetail && selectedDetail.id === detail.id) {
      setSelectedDetail(null);
      return;
    }
    setSelectedDetail(detail);
    try {
      setDataLoading(true);

      setNewsIndex(0); // 선택할 때 뉴스 인덱스 초기화
      setGithubIndex(0); // 선택할 때 GitHub 링크 인덱스 초기화
      const [newGitDatas, newNewsDatas] = await Promise.all([
        fetchAllGenGithubPJTtoKeyword(detail.id),
        fetchNewstoKeyword(detail.id),
      ]);

      // 데이터가 존재하는 경우 각각 상태 업데이트
      if (newGitDatas) setGithubdatas(newGitDatas?.repositories ?? []);
      if (newNewsDatas) setNewsdatas(newNewsDatas?.items ?? []);
    } finally {
      setDataLoading(false);
    }
  };

  const handeInfoClick = () => {
    alert("인포아이콘클릭");
  };

  const handleMindMapItemClick = useCallback(
    (itemId) => {
      if (selectedDetail && selectedDetail.id === itemId) {
        setSelectedDetail(null);
        return;
      }
      setSelectedDetail(mindMapData.nodes.find((node) => node.id === itemId));
    },
    [selectedDetail, mindMapData]
  );

  return (
    <>
      <Helmet>
        <title>마인드맵페이지</title>
      </Helmet>

      <div className="h-full w-full flex flex-col relative">
        {/* 검색창 */}
        <SearchBar
          handleInfoClick={handeInfoClick}
          handleSearch={handleSearch}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
        <div className="flex-1 m-auto w-full my-2 max-w-5xl relative">
          <DefaultButton
            text="AI Support"
            className="absolute right-0 animate-bounce hover:animate-none "
            onClick={() => setIsPlanOpen(true)}
          />
          {/* 추천키워드 */}
          <CloudOverlay />
        </div>
        {/* 컨텐츠 레이아웃 */}
        <div className="flex justify-center">
          {/* 컨텐츠 영역 */}
          <div className="w-full max-w-5xl flex bg-white shadow-lg rounded-lg border overflow-hidden">
            {mindMapData?.nodes?.length === 0 ? (
              // 미검색 시의 문구
              <NotYetSearchText />
            ) : (
              // 마인드맵 영역
              <>
                <MindMap
                  onClick={handleMindMapItemClick}
                  mindMapColorData={mindMapColorData}
                  mindMapData={mindMapData}
                />
                {/* 관련 뉴스 리스트 영역 */}
                <div className="w-1/3 p-6 bg-blue-100 border-l border-gray-300">
                  <h2 className="text-center font-bold mb-4">
                    ← 키워드와 관련된 정보 →
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    {mindMapData.nodes?.map((item, index) => (
                      <div key={item.id}>
                        <div
                          id={`detail-${item.id}`}
                          onClick={() => handleDetailClick(item)}
                          className="cursor-pointer font-semibold text-lg hover:text-blue-500 transition-colors duration-200"
                        >
                          {index + 1}. {item.id}
                        </div>

                        {/* 뉴스 및 GitHub 링크 섹션 */}
                        {selectedDetail === item && (
                          <div className="items-center my-2 space-y-4">
                            {/* 관련 뉴스 카드 */}
                            <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
                              <h3 className="font-bold text-base text-gray-800 mb-2">
                                관련 뉴스
                              </h3>
                              {dataLoading && (
                                <p className="text-gray-400">
                                  데이터 로딩 중...
                                </p>
                              )}
                              {!dataLoading &&
                                (newsDatas.length ? (
                                  <NewsCarousel
                                    slides={newsDatas}
                                    currentIndex={newsIndex}
                                    setCurrentIndex={setNewsIndex}
                                  />
                                ) : (
                                  <p className="text-gray-400">
                                    뉴스 정보가 없습니다
                                  </p>
                                ))}
                            </div>

                            {/* GitHub 링크 카드 */}
                            <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
                              <h3 className="font-bold text-base text-gray-800 mb-2">
                                GitHub 링크
                              </h3>
                              {dataLoading && (
                                <p className="text-gray-400">
                                  데이터 로딩 중...
                                </p>
                              )}
                              {!dataLoading &&
                                (githubDatas.length ? (
                                  <GithubCarousel
                                    slides={githubDatas}
                                    currentIndex={githubIndex}
                                    setCurrentIndex={setGithubIndex}
                                  />
                                ) : (
                                  <p className="text-gray-400">
                                    링크 정보가 없습니다
                                  </p>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <PortalModal
          className="max-w-4xl"
          isOpen={isPlanOpen}
          onClose={() => setIsPlanOpen(false)}
        >
          <AIPlanForm onClose={() => setIsPlanOpen(false)} />
        </PortalModal>
      </div>
    </>
  );
}

export default MindMapPage;
