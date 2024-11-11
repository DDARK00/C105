package com.ssafy.goodIdea.flowChart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.goodIdea.flowChart.entity.Flowchart;

@Repository
public interface FlowChartRepository extends JpaRepository<Flowchart, Long> {
    
}
