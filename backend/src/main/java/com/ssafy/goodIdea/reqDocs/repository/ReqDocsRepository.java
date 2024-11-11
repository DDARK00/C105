package com.ssafy.goodIdea.reqDocs.repository;

import com.ssafy.goodIdea.reqDocs.entity.ReqDocs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReqDocsRepository extends JpaRepository<ReqDocs, Long> {

}
