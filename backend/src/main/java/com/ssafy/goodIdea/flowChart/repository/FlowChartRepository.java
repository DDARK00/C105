package com.ssafy.goodIdea.flowChart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.goodIdea.flowChart.entity.Flowchart;

public interface FlowChartRepository extends JpaRepository<Flowchart, Long> {
//    @Modifying
    @Query("DELETE FROM Flowchart c WHERE c.idea.id = :ideaId")
    void deleteAllByIdeaId(@Param("ideaId") Long ideaId);
}
