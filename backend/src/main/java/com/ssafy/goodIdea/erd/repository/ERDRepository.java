package com.ssafy.goodIdea.erd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.goodIdea.erd.entity.ERD;

@Repository
public interface ERDRepository extends JpaRepository<ERD, Long> {
    @Query("DELETE FROM Erd e WHERE e.idea.id = :ideaId")
    void deleteAllByIdeaId(@Param("ideaId") Long ideaId);
}
