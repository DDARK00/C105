package com.ssafy.project_service.project.service;


import com.ssafy.project_service.client.UserServiceClient;
import com.ssafy.project_service.common.dto.GitLabUserResponseDto;
import com.ssafy.project_service.common.dto.UserDto;
import com.ssafy.project_service.common.entity.RoleType;
import com.ssafy.project_service.common.exception.BaseException;

import com.ssafy.project_service.common.exception.ErrorType;
import com.ssafy.project_service.idea.dto.response.IdeaCreateResponseDto;
import com.ssafy.project_service.idea.entity.Idea;
import com.ssafy.project_service.idea.repository.IdeaRepository;
import com.ssafy.project_service.mongodb.entity.MongoIdea;
import com.ssafy.project_service.mongodb.repository.MongoIdeaRepository;
import com.ssafy.project_service.mongodb.service.MongoIdeaService;
import com.ssafy.project_service.project.dto.request.ProjectCreateRequestDto;
import com.ssafy.project_service.project.dto.request.ProjectUpdateRequestDto;
import com.ssafy.project_service.project.dto.response.GitLabProjectResponseDto;
import com.ssafy.project_service.project.dto.response.ProjectResponseDto;
import com.ssafy.project_service.project.entity.Project;
import com.ssafy.project_service.project.entity.ProjectType;
import com.ssafy.project_service.project.repository.ProjectRepository;
import com.ssafy.project_service.userProject.entity.UserProject;
import com.ssafy.project_service.userProject.repository.UserProjectRepository;
import com.ssafy.project_service.userProject.service.UserProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserProjectService userProjectService;
    private final UserServiceClient userServiceClient;
    private final UserProjectRepository userProjectRepository;
    private final IdeaRepository ideaRepository;


    public Optional<Project> findByUserIdAndProjectType(Long userId, ProjectType projectType) {
        // UserId를 통해 UserProject 목록을 가져옴
        System.out.println("findByUserIdAndProjectType " + userId);
        List<UserProject> userProjects = userProjectService.findByUserId(userId);

        // 해당 userProjects에서 ProjectType 필터링
        return userProjects.stream()
                .map(UserProject::getProject)  // UserProject에서 Project 추출
                .filter(project -> project.getProjectType().equals(projectType))  // projectType 필터링
                .findFirst();  // Optional로 반환
    }
    /*
    * @param user
    * @param ProjectCreateRequestDto
    * @param GitLabProjectResponseDto
    * @param List<GitLabUserResponseDto>
    */
//    @Transactional
    public ProjectResponseDto createProject(UserDto user, ProjectCreateRequestDto dto, GitLabProjectResponseDto myProject, List<GitLabUserResponseDto> users) {

//        같은 타입의 프로젝트를 생성하려할 경우 에러 발생
        Optional<Project> ou = findByUserIdAndProjectType(user.getId(), dto.getProjectType());
        if(ou.isPresent()){
            throw new BaseException(ErrorType.PROJECT_ALREADY_EXIST);
        }

        Project project = projectRepository.save(
                Project.builder()
                    .teamName(dto.getTeamName())
                    .projectType(dto.getProjectType())
                    .gitlabName(myProject.getName())
                    .gitlab_url(myProject.getWebUrl())
                    .leader(user.getId())
                    .gitLabProjectId(myProject.getProject_id())
                .build()
        );


        users.stream()
                .filter(Objects::nonNull) // null 값 제거
                .forEach(us -> {
                    Optional<UserDto> member = userServiceClient.getUser(us.getUsername());
                    if (member.isEmpty()) {
                        member = userServiceClient.joinMember( UserDto.builder()
                                .username(us.getUsername())
                                .roleType(RoleType.USER)
                                .build());
                    }
                    userProjectRepository.saveAndFlush(UserProject.builder()
                            .project(project)
                            .userId(userServiceClient.getUser(us.getUsername()).get().getId())
                            .build());
                });

        return ProjectResponseDto.builder()
                .project_id(project.getId())
                .projectType(project.getProjectType())
                .teamName(project.getTeamName())
                .gitlabName(project.getGitlabName())
                .leader(project.getLeader().toString())
                .gitlab_url(project.getGitlab_url())
                .gitlab_project_id(project.getGitLabProjectId())
                .members(
                        userProjectService.findAllByProjectId(project.getId())
                                .stream()
                                .map( up -> {
                                    Long upUserId = up.getUserId();
                                    UserDto us = userServiceClient.getUserById(upUserId).get();
                                    return UserDto.builder()
                                            .id(us.getId())
                                            .name(us.getName())
                                            .grade(us.getGrade())
                                            .locationType(us.getLocationType())
                                            .username(us.getUsername())
                                            .roleType(us.getRoleType())
                                            .build();
                                })
                                .collect(Collectors.toList())
                )
                .build();
    }

    /*
     * @param User
     * @param projectId
     */
    public ProjectResponseDto getProject(UserDto user, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow( ()-> new BaseException(ErrorType.PROJECT_NOT_FOUND));
        Idea mainIdea;
        if ( project.getMainIdeaId() == null ) {
            mainIdea = Idea.builder().build();
        }
        else {
            Optional<Idea> oi = ideaRepository.findById(project.getMainIdeaId());
            mainIdea = oi.orElseGet( () -> Idea.builder().build() );
        }
        String leaderUsername = userServiceClient.getUserById(project.getLeader())
                .map(UserDto::getUsername)
                .orElse(null);

        return ProjectResponseDto.builder()
                    .project_id(project.getId())
                    .projectType(project.getProjectType())
                    .teamName(project.getTeamName())
                    .mainIdea(IdeaCreateResponseDto.builder()
                            .ideaId(mainIdea.getId())
                            .serviceName(mainIdea.getServiceName())
                            .background(mainIdea.getBackground())
                            .expectedEffect(mainIdea.getExpectedEffect())
                            .introduction(mainIdea.getIntroduction())
                            .target(mainIdea.getTarget())
                            .build())
                    .gitlabName(project.getGitlabName())
                    .gitlab_url(project.getGitlab_url())
                    .leader(leaderUsername)
                    .members(
                            userProjectService.findAllByProjectId(projectId)
                                    .stream()
                                    .map( up -> {
                                        UserDto us = up.getUser();
                                        return UserDto.builder()
                                                .id(us.getId())
                                                .name(us.getName())
                                                .grade(us.getGrade())
                                                .locationType(us.getLocationType())
                                                .username(us.getUsername())
                                                .roleType(us.getRoleType())
                                                .build();
                                    })
                                    .collect(Collectors.toList())
                    )
                .build();
    }

    /*
     * @param User
     */
    public List<ProjectResponseDto> getUserProjects(UserDto user, Optional<ProjectType> projectType, Optional<Integer> grade) {
        List<UserProject> userProjects;

        if ( user.getRoleType() != RoleType.CONSULTANT) {
            // 동적 쿼리 처리
            if (projectType.isPresent() && grade.isPresent()) {
                userProjects = userProjectService.findByUserIdAndGradeAndProjectType(user.getId(), grade.get(), projectType.get());
            } else if (projectType.isPresent()) {
                userProjects = userProjectService.findByUserIdAndProjectType(user.getId(), projectType.get());
            } else if (grade.isPresent()) {
                userProjects = userProjectService.findByUserIdAndGrade(user.getId(), grade.get());
            } else {
                userProjects = userProjectService.findByUserId(user.getId());
            }

            return userProjects.stream()
                    .map( userProject -> {
                        Project project = userProject.getProject();
                        return ProjectResponseDto.builder()
                                .project_id(project.getId())
                                .teamName(project.getTeamName())
                                .gitlabName(project.getGitlabName())
                                .gitlab_url(project.getGitlab_url())
                                .projectType(project.getProjectType())
                                .build();
                    })
                    .collect(Collectors.toList());
        }
        else {
            List<Long> projectIds = userProjectRepository.findDistinctProjectIds();

            // 동적 쿼리 처리
            if (projectType.isPresent() && grade.isPresent()) {
                projectIds = projectIds.stream().map( (projectId) -> {
                    Project nowp = projectRepository.findById(projectId).orElseThrow( () -> new BaseException(ErrorType.PROJECT_NOT_FOUND));
                    if ( nowp.getProjectType().equals(projectType.get())
                            && userServiceClient.getUserById(nowp.getLeader()).orElseThrow( () -> new BaseException(ErrorType.USER_NOT_FOUND))
                            .getGrade().equals(grade.get()) ){
                        return projectId;
                    }
                    else
                        return null;
                })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            } else if (projectType.isPresent()) {
                projectIds = projectIds.stream().map( (projectId) -> {
                    Project nowp = projectRepository.findById(projectId).orElseThrow( () -> new BaseException(ErrorType.PROJECT_NOT_FOUND));
                    if ( nowp.getProjectType().equals(projectType.get())){
                        return projectId;
                    }
                    else
                        return null;
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            } else if (grade.isPresent()) {
                projectIds = projectIds.stream().map( (projectId) -> {
                    Project nowp = projectRepository.findById(projectId).orElseThrow( () -> new BaseException(ErrorType.PROJECT_NOT_FOUND));
                    if ( userServiceClient.getUserById(nowp.getLeader()).orElseThrow( () -> new BaseException(ErrorType.USER_NOT_FOUND))
                            .getGrade().equals(grade.get()) ){
                        return projectId;
                    }
                    else
                        return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
            }

            return projectIds.stream().map( (projectId) -> {
                Optional<Project> op = projectRepository.findById(projectId);
                if ( op.isEmpty() ) {
                    return null;
                }

                else {
                    Project np = op.get();
                    return ProjectResponseDto.builder()
                            .project_id(np.getId())
                            .teamName(np.getTeamName())
                            .gitlabName(np.getGitlabName())
                            .gitlab_url(np.getGitlab_url())
                            .projectType(np.getProjectType())
                            .build();
                }
            }
            )
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }


    }

    /*
     * @param ProjectUpdateRequestDto
     */
    @Transactional
    public ProjectResponseDto updateProject(UserDto user, Long projectId, ProjectUpdateRequestDto dto) {
        UserProject userProject = userProjectService.findByUser_IdAndProject_Id(user.getId(), projectId)
                .orElseThrow( () -> new BaseException(ErrorType.PROJECT_NOT_FOUND));

        if (!Objects.equals(userProject.getUser().getId(), user.getId()))
            throw new BaseException(ErrorType.UNAUTHORIZED);

        Project project = projectRepository.findById(projectId)
                .orElseThrow( ()-> new BaseException(ErrorType.PROJECT_NOT_FOUND));

        // System.out.println(dto.getMainIdeaId());
        // System.out.println(dto.getProjectType());
        // System.out.println(dto.getTeamName());

        if ( dto.getProjectType() != null)
            project.setProjectType(dto.getProjectType());
        if ( dto.getTeamName() != null)
            project.setTeamName(dto.getTeamName());
        if ( dto.getMainIdeaId() != null)
            project.setMainIdeaId(dto.getMainIdeaId());
        projectRepository.save(project);

        return ProjectResponseDto.builder()
                .project_id(project.getId())
                .projectType(project.getProjectType())
                .teamName(project.getTeamName())
                .gitlabName(project.getGitlabName())
                .gitlab_url(project.getGitlab_url())
                .gitlab_project_id(project.getGitLabProjectId())
                .build();
    }

    /*
     * @param ProjectCreateRequestDto
     */
    @Transactional
    public void deleteProject(UserDto user, Long projectId) {

        List<UserProject> userProject = userProjectService.findAllByProjectId(projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow( ()-> new BaseException(ErrorType.PROJECT_NOT_FOUND));
        Optional<UserDto> ol = userServiceClient.getUserById(project.getLeader());
        System.out.println(user.getUsername());
        UserDto leader = ol.orElseThrow( () -> new BaseException(ErrorType.USER_NOT_FOUND));
        System.out.println(leader.getUsername());
        //        팀장만 삭제 가능
        if ( !leader.getId().equals(user.getId()) ){
            throw new BaseException(ErrorType.NOT_TEAM_LEADER);
        }

        userProjectRepository.deleteAll(userProject);
        projectRepository.delete(project);
    }

}
