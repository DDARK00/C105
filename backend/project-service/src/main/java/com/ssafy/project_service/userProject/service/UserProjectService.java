package com.ssafy.project_service.userProject.service;

import com.ssafy.project_service.client.UserServiceClient;
import com.ssafy.project_service.common.dto.UserDto;
import com.ssafy.project_service.project.entity.ProjectType;
import com.ssafy.project_service.userProject.entity.UserProject;
import com.ssafy.project_service.userProject.repository.UserProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProjectService {

    private final UserProjectRepository userProjectRepository;
    private final UserServiceClient userServiceClient;

    public List<UserProject> findAllByUserId(Long userId) {
        List<UserProject> userProjects = userProjectRepository.findByUserId(userId);
        Optional<UserDto> userDto = userServiceClient.getUserById(userId);

        userDto.ifPresent(user -> userProjects.forEach(up -> up.setUser(user)));

        return userProjects;
    }

    public List<UserProject> findAllByProjectId(Long projectId) {
        List<UserProject> userProjects = userProjectRepository.findByProjectId(projectId);
        System.out.println(userProjects);
        userProjects.forEach(up -> {
            if (up.getUserId() != null) {
                Optional<UserDto> userDto = userServiceClient.getUserById(up.getUserId());
                userDto.ifPresent(up::setUser);
            }
        });

        return userProjects;
    }


    public List<UserProject> findByUserIdAndGrade(Long userId, Integer grade) {
        Optional<UserDto> userDto = userServiceClient.getUserById(userId);

        if (userDto.isPresent() && userDto.get().getGrade().equals(grade)) {
            List<UserProject> userProjects = userProjectRepository.findByUserId(userId);
            userProjects.forEach(up -> up.setUser(userDto.get()));

            return userProjects;
        }
        return List.of();
    }

    public Optional<UserProject> findByUser_IdAndProject_Id(Long userId, Long projectId) {
        Optional<UserProject> userProject = userProjectRepository.findByUserIdAndProjectId(userId, projectId);

        if (userProject.isPresent()) {
            Optional<UserDto> userDto = userServiceClient.getUserById(userId);
            userDto.ifPresent(user -> userProject.get().setUser(user));
        }

        return userProject;
    }

    public List<UserProject> findByUserIdAndProjectType(Long userId, ProjectType projectType) {
        List<UserProject> userProjects = userProjectRepository.findByUserId(userId).stream()
                .filter(up -> up.getProject().getProjectType().equals(projectType))
                .collect(Collectors.toList());

        Optional<UserDto> userDto = userServiceClient.getUserById(userId);
        userDto.ifPresent(user -> userProjects.forEach(up -> up.setUser(user)));

        return userProjects;
    }

    public List<UserProject> findByUserId(Long userId) {
        List<UserProject> userProjects = userProjectRepository.findByUserId(userId);
        Optional<UserDto> userDto = userServiceClient.getUserById(userId);

        userDto.ifPresent(user -> userProjects.forEach(up -> up.setUser(user)));

        return userProjects;
    }


    public List<UserProject> findByUserIdAndGradeAndProjectType(Long userId, Integer grade, ProjectType projectType) {
        Optional<UserDto> userDto = userServiceClient.getUserById(userId);

        if (userDto.isPresent() && userDto.get().getGrade().equals(grade)) {
            List<UserProject> userProjects = userProjectRepository.findByUserId(userId).stream()
                    .filter(up -> up.getProject().getProjectType().equals(projectType))
                    .collect(Collectors.toList());

            userProjects.forEach(up -> up.setUser(userDto.get()));

            return userProjects;
        }
        return List.of();
    }
}