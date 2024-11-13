package com.ssafy.project_service.flowChart.repository;

import com.ssafy.project_service.flowChart.entity.Flowchart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FlowChartRepository extends JpaRepository<Flowchart, Long> {
    @Modifying
    @Query("DELETE FROM Flowchart c WHERE c.idea.id = :ideaId")
    void deleteAllByIdeaId(@Param("ideaId") Long ideaId);
}


