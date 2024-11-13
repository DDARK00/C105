package com.ssafy.project_service.planner.repository;


import com.ssafy.project_service.planner.entity.Planner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlannerRepository extends JpaRepository<Planner, Long> {
    Optional<Planner> findByIdeaId(Long ideaId);

    @Modifying
    @Query("DELETE FROM Planner p WHERE p.idea.id = :ideaId")
    void deleteAllByIdeaId(@Param("ideaId") Long ideaId);

}
