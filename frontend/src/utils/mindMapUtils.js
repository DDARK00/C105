import { colorName } from "../global";

// 데이터를 마인드맵 형식에 맞게 만드는 함수
export function CreateMindMapData(searchKeyword, SubKeywords) {
  const newNodes = SubKeywords.map((node, idx) => ({
    id: node,
    category: colorName[idx % colorName.length],
  }));

  const newLinks = SubKeywords.map((node) => ({
    source: searchKeyword,
    target: node,
  }));

  return {
    nodes: [
      {
        id: searchKeyword,
        category: "center",
      },
      ...newNodes,
    ],
    links: newLinks,
  };
}
