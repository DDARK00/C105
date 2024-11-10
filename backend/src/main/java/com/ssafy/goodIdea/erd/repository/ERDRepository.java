package com.ssafy.goodIdea.erd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.goodIdea.erd.entity.ERD;

public interface ERDRepository extends JpaRepository<ERD, Long> {
    
}
