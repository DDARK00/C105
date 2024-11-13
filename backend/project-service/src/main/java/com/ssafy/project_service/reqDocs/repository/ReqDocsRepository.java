package com.ssafy.project_service.reqDocs.repository;


import com.ssafy.project_service.reqDocs.entity.ReqDocs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReqDocsRepository extends JpaRepository<ReqDocs, Long> {
    Optional<ReqDocs> findByIdeaId(Long ideaId);

    @Modifying
    @Query("DELETE FROM ReqDocs r WHERE r.idea.id = :ideaId")
    void deleteAllByIdeaId(@Param("ideaId") Long ideaId);

}
