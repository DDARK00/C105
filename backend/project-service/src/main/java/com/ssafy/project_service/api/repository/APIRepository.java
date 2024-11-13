package com.ssafy.project_service.api.repository;


import com.ssafy.project_service.api.entity.API;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface APIRepository extends JpaRepository<API, Long> {
    @Modifying
    @Query("DELETE FROM API a WHERE a.apiDocs.id = :apiDocs")
    void deleteAllByApiDocsId(@Param("apiDocs") Long apiDocsId);

}

