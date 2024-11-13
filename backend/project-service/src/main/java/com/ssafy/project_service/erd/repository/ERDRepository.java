package com.ssafy.project_service.erd.repository;

import com.ssafy.project_service.erd.entity.ERD;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ERDRepository extends JpaRepository<ERD, Long> {
    @Modifying
    @Query("DELETE FROM ERD e WHERE e.idea.id = :ideaId")
    void deleteAllByIdeaId(@Param("ideaId") Long ideaId);

}

