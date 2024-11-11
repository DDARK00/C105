package com.ssafy.goodIdea.erd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.goodIdea.erd.entity.ERD;

@Repository
public interface ERDRepository extends JpaRepository<ERD, Long> {
    
}
