package com.ssafy.goodIdea.flowChart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.goodIdea.flowChart.entity.Flowchart;

@Repository
public interface FlowChartRepository extends JpaRepository<Flowchart, Long> {
    @Query("DELETE FROM FlowChart c WHERE c.idea.id = :ideaId")
    void deleteAllByIdeaId(@Param("ideaId") Long ideaId);
}
