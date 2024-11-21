package com.ssafy.project_service.client;

import com.ssafy.project_service.common.dto.GitLabUserResponseDto;
import com.ssafy.project_service.project.dto.response.GitLabProjectResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "auth-service")
public interface GitLabApiClient {

    /*
    GET 요청으로 username에 해당하는 GitLab 프로젝트 리스트 조회
     */
    @GetMapping("/api/v1/gitlab/getGitLabProjects/{username}")
    List<GitLabProjectResponseDto> getGitLabProjects(@PathVariable("username") String username);

    /*
    GET 요청으로 username과 projectId에 해당하는 GitLab 프로젝트 조회
     */
    @GetMapping("/api/v1/gitlab/getGitLabProject/{username}/{projectId}")
    GitLabProjectResponseDto getGitLabProject(@PathVariable("username") String username,@PathVariable("projectId") Long projectId);

    /*
    GET 요청으로 username과 projectId 해당하는 GitLab 프로젝트 리스트 조회
     */
    @GetMapping("/api/v1/gitlab/getGitLabMembers/{username}/{projectId}")
    List<GitLabUserResponseDto> getGitLabMembers(@PathVariable("username") String username, @PathVariable("projectId") Long projectId);
}
