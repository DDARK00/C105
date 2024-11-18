import { useCallback, useEffect } from "react";
import { useRef } from "react";
import * as d3 from "d3";
import { mindMapColorData } from "../../global";

const MindMap = ({ mindMapData, onClick }) => {
  const svgRef = useRef();
  const clickHandle = useCallback(
    (event, d) => {
      onClick(d.id);
      // console.log("Clicked node:", d);
    },
    [onClick]
  );

  useEffect(() => {
    const width = 800;
    const height = 800;

    // SVG 초기화
    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 800 800`) // 800x800 좌표계를 사용하지만 SVG 크기는 부모 컨테이너에 맞게 자동 조정
      .attr("preserveAspectRatio", "xMidYMid meet"); // 화면 비율 유지

    svg.selectAll("*").remove();

    // 시뮬레이션 설정
    const simulation = d3
      .forceSimulation(mindMapData.nodes)
      .force(
        "link",
        d3
          .forceLink(mindMapData.links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(10));

    // 링크 그리기
    const link = svg
      .append("g")
      .selectAll("line")
      .data(mindMapData.links)
      .join("line")
      .style("stroke", "#999")
      .style("stroke-width", 0.5);

    // 노드 컨테이너 생성
    const node = svg
      .append("g")
      .selectAll("g")
      .data(mindMapData.nodes)
      .join("g")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // 배경 사각형 추가
    node
      .append("rect")
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", (d) => mindMapColorData[d.category])
      .style("cursor", "pointer")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .on("click", function (event, d) {
        clickHandle(event, d);
      });

    // 텍스트 추가
    const text = node
      .append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .style("cursor", "pointer")
      .style("font-size", "20px")
      // .style("font-weight", "bold")
      .style("font-family", "NEXON Lv1 Gothic")
      .on("click", function (event, d) {
        clickHandle(event, d);
      });

    // 텍스트 크기에 맞춰 사각형 크기 조정
    node
      .selectAll("rect")
      .attr("width", function () {
        const textWidth = this.parentNode.querySelector("text").getBBox().width;
        return textWidth + 30;
      })
      .attr("height", 50)
      .attr("x", function () {
        const width = this.getAttribute("width");
        return -width / 2;
      })
      .attr("y", -25);

    // 시뮬레이션 업데이트
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // 드래그 함수들
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [clickHandle, mindMapData]);

  return (
    <div className="flex justify-center items-center w-2/3 h-screen">
      {/* 컨테이너의 너비와 높이에 맞춰 SVG 100% 적용 */}
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default MindMap;
