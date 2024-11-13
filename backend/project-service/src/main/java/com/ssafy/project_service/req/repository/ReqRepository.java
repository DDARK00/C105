package com.ssafy.project_service.req.repository;


import com.ssafy.project_service.req.entity.Req;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReqRepository extends JpaRepository<Req, Long> {
    @Modifying
    @Query("DELETE FROM Req r WHERE r.reqDocs.id = :reqDocsId")
    void deleteAllByIReqDocsId(@Param("reqDocsId") Long reqDocsId);

}
