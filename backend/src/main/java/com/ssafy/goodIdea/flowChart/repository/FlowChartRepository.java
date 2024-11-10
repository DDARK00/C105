package com.ssafy.goodIdea.flowChart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.goodIdea.flowChart.entity.Flowchart;

public interface FlowChartRepository extends JpaRepository<Flowchart, Long> {
    
}
