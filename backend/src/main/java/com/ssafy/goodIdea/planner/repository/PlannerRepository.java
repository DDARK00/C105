package com.ssafy.goodIdea.planner.repository;

import com.ssafy.goodIdea.planner.entity.Planner;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlannerRepository extends JpaRepository<Planner, Long> {
    Optional<Planner> findByIdeaId(Long ideaId);
}
