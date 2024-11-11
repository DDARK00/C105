package com.ssafy.goodIdea.req.repository;

import com.ssafy.goodIdea.req.entity.Req;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReqRepository extends JpaRepository<Req, Long> {
}
