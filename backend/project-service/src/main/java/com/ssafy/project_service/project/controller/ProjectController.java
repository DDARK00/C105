package com.ssafy.project_service.project.controller;

import com.fasterxml.jackson.core.JsonProcessingException;

import com.ssafy.project_service.client.GitLabApiClient;
import com.ssafy.project_service.client.UserServiceClient;
import com.ssafy.project_service.common.dto.GitLabUserResponseDto;
import com.ssafy.project_service.common.dto.UserDto;
import com.ssafy.project_service.common.entity.MsgType;
import com.ssafy.project_service.common.exception.ApiResponse;
import com.ssafy.project_service.jwt.JwtTokenProvider;
import com.ssafy.project_service.project.dto.request.ProjectCreateRequestDto;
import com.ssafy.project_service.project.dto.request.ProjectUpdateRequestDto;
import com.ssafy.project_service.project.dto.response.GitLabProjectResponseDto;
import com.ssafy.project_service.project.dto.response.ProjectResponseDto;
import com.ssafy.project_service.project.entity.ProjectType;
import com.ssafy.project_service.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/project")
public class ProjectController {

    private final ProjectService projectService;
    private final GitLabApiClient gitLabApiClient;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserServiceClient userServiceClient;

/*
* 프로젝트 생성
* return MsgType
* */
    @PostMapping("/create")
    public ApiResponse<ProjectResponseDto> createProject(@RequestHeader("Authorization") String authorizationHeader,
                                                         @RequestBody ProjectCreateRequestDto dto) throws JsonProcessingException {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenProvider.extractSubject(token);
        UserDto user = userServiceClient.getUser(username).orElseThrow();

        GitLabProjectResponseDto myProject = gitLabApiClient.getGitLabProject(username, dto.getProjectId());
        List<GitLabUserResponseDto> users = gitLabApiClient.getGitLabMembers(username, dto.getProjectId());
        return ApiResponse.ok(projectService.createProject(user, dto, myProject, users));
    }

/*
 * 프로젝트 상세 조회
 * return ProjectResponseDto
 * */
    @GetMapping("/{projectId}")
    public ApiResponse<ProjectResponseDto> getProject(@RequestHeader("Authorization") String authorizationHeader,
                                                         @PathVariable("projectId") Long projectId) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenProvider.extractSubject(token);
        UserDto user = userServiceClient.getUser(username).orElseThrow();
        return ApiResponse.ok(projectService.getProject(user, projectId));
    }

/*
 * 유저 프로젝트 목록 조회
 * */
    @GetMapping("")
    public ApiResponse<List<ProjectResponseDto>> getUserProjects(@RequestHeader("Authorization") String authorizationHeader,
                                                                 @RequestParam(value = "projectType", required = false) Optional<ProjectType> projectType,
                                                                 @RequestParam(value = "grade", required = false) Optional<Integer> grade) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenProvider.extractSubject(token);
        UserDto user = userServiceClient.getUser(username).orElseThrow();
        return ApiResponse.ok(projectService.getUserProjects(user, projectType, grade));
    }

/*
 * 유저 Gitlab 프로젝트 리스트 조회
 * return List<ProjectResponseDto>
 * */
    @GetMapping("/gitlab")
    public ApiResponse<List<GitLabProjectResponseDto>> getGitlabProjects(@RequestHeader("Authorization") String authorizationHeader) throws JsonProcessingException {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenProvider.extractSubject(token);
        UserDto user = userServiceClient.getUser(username).orElseThrow();
        List<GitLabProjectResponseDto> projects =  gitLabApiClient.getGitLabProjects(user.getUsername());
        return ApiResponse.ok(projects);
    }

/*
 * 프로젝트 수정
 * return ProjectResponseDto
 * */
    @PutMapping("/{projectId}/update")
    public ApiResponse<ProjectResponseDto> updateProject(@RequestHeader("Authorization") String authorizationHeader,
                                              @PathVariable("projectId") Long projectId,
                                              @RequestBody ProjectUpdateRequestDto dto) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenProvider.extractSubject(token);
        UserDto user = userServiceClient.getUser(username).orElseThrow();
        return ApiResponse.ok(projectService.updateProject(user, projectId, dto));
    }

/*
 * 프로젝트 삭제
 * return MsgType
 * */
    @DeleteMapping("/{projectId}/delete")
    public ApiResponse<MsgType> deleteProject(@RequestHeader("Authorization") String authorizationHeader,
                                              @PathVariable("projectId") Long projectId) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenProvider.extractSubject(token);
        UserDto user = userServiceClient.getUser(username).orElseThrow();
        projectService.deleteProject(user, projectId);
        return ApiResponse.ok(MsgType.PROJECT_DELETE_SUCCESS);
    }

}
