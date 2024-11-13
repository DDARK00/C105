package com.ssafy.user_service.user.repository;

import com.ssafy.user_service.user.entity.RoleType;
import com.ssafy.user_service.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    List<User> findAllByRoleType(RoleType roleType);
}