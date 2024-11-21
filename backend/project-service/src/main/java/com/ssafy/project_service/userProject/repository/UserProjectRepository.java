package com.ssafy.project_service.userProject.repository;


import com.ssafy.project_service.userProject.entity.UserProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserProjectRepository extends JpaRepository<UserProject, Long> {


    List<UserProject> findByUserId(@Param("userId") Long userId);

    List<UserProject> findByProjectId(@Param("projectId") Long projectId);

    Optional<UserProject> findByUserIdAndProjectId(Long userId, Long projectId);

    boolean existsByUserIdAndProject_Id(Long userId, Long projectId);

    @Query("SELECT DISTINCT u.project.id FROM UserProject u")
    List<Long> findDistinctProjectIds();
}
