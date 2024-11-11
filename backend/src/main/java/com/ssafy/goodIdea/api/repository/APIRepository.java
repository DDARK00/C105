package com.ssafy.goodIdea.api.repository;

import com.ssafy.goodIdea.api.entity.API;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface APIRepository extends JpaRepository<API, Long> {

}
