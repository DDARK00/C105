package com.ssafy.goodIdea.req.repository;

import com.ssafy.goodIdea.req.entity.Req;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReqRepository extends JpaRepository<Req, Long> {
    @Modifying
    @Query("DELETE FROM Req r WHERE r.reqDocs.id = :reqDocsId")
    void deleteAllByIReqDocsId(@Param("reqDocsId") Long reqDocsId);
}
