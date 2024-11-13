package com.ssafy.goodIdea.apiDocs.repository;

import com.ssafy.goodIdea.apiDocs.entity.APIDocs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface APIDocsRepository extends JpaRepository<APIDocs, Long> {
    @Modifying
    @Query("DELETE FROM APIDocs a WHERE a.idea.id = :ideaId")
    void deleteAllByIdeaId(@Param("ideaId") Long ideaId);
    APIDocs findByIdea_Id(Long ideaId);
}
