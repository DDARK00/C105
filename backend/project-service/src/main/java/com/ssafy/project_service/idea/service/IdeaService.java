package com.ssafy.project_service.idea.service;

import java.util.UUID;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Objects;

import com.ssafy.project_service.api.repository.APIRepository;
import com.ssafy.project_service.apiDocs.entity.APIDocs;
import com.ssafy.project_service.apiDocs.repository.APIDocsRepository;
import com.ssafy.project_service.comment.entity.Comment;
import com.ssafy.project_service.comment.repository.CommentRepository;
import com.ssafy.project_service.common.dto.UserDto;
import com.ssafy.project_service.common.exception.BaseException;
import com.ssafy.project_service.common.exception.ErrorType;
import com.ssafy.project_service.erd.entity.ERD;
import com.ssafy.project_service.erd.repository.ERDRepository;
import com.ssafy.project_service.flowChart.entity.Flowchart;
import com.ssafy.project_service.flowChart.repository.FlowChartRepository;
import com.ssafy.project_service.idea.dto.request.IdeaCreateRequestDto;
import com.ssafy.project_service.idea.dto.request.IdeaUpdateRequestDto;
import com.ssafy.project_service.idea.dto.response.IdeaCreateResponseDto;
import com.ssafy.project_service.idea.dto.response.IdeaDetailResponseDto;
import com.ssafy.project_service.idea.dto.response.IdeaListResponseDto;
import com.ssafy.project_service.idea.dto.response.IdeaUpdateResponseDto;
import com.ssafy.project_service.idea.entity.Idea;
import com.ssafy.project_service.idea.repository.IdeaRepository;
import com.ssafy.project_service.mongodb.entity.MongoIdea;
import com.ssafy.project_service.mongodb.entity.apiDoc.ApiDoc;
import com.ssafy.project_service.mongodb.entity.apiDoc.ApiDocs;
import com.ssafy.project_service.mongodb.entity.apiDoc.ApiImportance;
import com.ssafy.project_service.mongodb.entity.apiDoc.MethodType;
import com.ssafy.project_service.mongodb.entity.reqDoc.IsRequired;
import com.ssafy.project_service.mongodb.entity.reqDoc.ReqDoc;
import com.ssafy.project_service.mongodb.entity.reqDoc.ReqDocs;
import com.ssafy.project_service.mongodb.entity.reqDoc.Status;
import com.ssafy.project_service.mongodb.repository.MongoIdeaRepository;
import com.ssafy.project_service.mongodb.service.MongoIdeaService;
import com.ssafy.project_service.planner.entity.Planner;
import com.ssafy.project_service.planner.repository.PlannerRepository;
import com.ssafy.project_service.project.entity.Project;
import com.ssafy.project_service.project.repository.ProjectRepository;
import com.ssafy.project_service.req.repository.ReqRepository;

import com.ssafy.project_service.reqDocs.repository.ReqDocsRepository;
import com.ssafy.project_service.userProject.repository.UserProjectRepository;
import com.ssafy.project_service.userProject.service.UserProjectService;
import org.springframework.stereotype.Service;



import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final ProjectRepository projectRepository;
    private final CommentRepository commentRepository;
    private final UserProjectRepository userProjectRepository;
    private final PlannerRepository plannerRepository;
    private final ReqDocsRepository reqDocsRepository;
    private final APIDocsRepository apiDocsRepository;
    private final ERDRepository erdRepository;
    private final FlowChartRepository flowChartRepository;
    private final APIRepository apiRepository;
    private final ReqRepository reqRepository;
    private final MongoIdeaService mongoIdeaService;
    private final MongoIdeaRepository mongoIdeaRepository;
    private final UserProjectService userProjectService;


    /*
     * 아이디어 생성
     * return created idea
     * */
    public IdeaCreateResponseDto createIdea(UserDto user, Long projectId, IdeaCreateRequestDto dto) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new BaseException(ErrorType.PROJECT_NOT_FOUND));

        Idea idea = Idea.builder()
                .project(project)
                .serviceName(dto.getServiceName())
                .background(dto.getBackground())
                .introduction(dto.getIntroduction())
                .target(dto.getTarget())
                .expectedEffect(dto.getExpectedEffect())
                .techStack(dto.getTechStack())
                .advancedStack(dto.getAdvancedStack())
                .projectTopic(dto.getProjectTopic())
                .x(dto.getX())
                .y(dto.getY())
                .color(dto.getColor())
                .darkColor(dto.getDarkColor())
                .animation(dto.getAnimation())
                .build();

        idea = ideaRepository.save(idea);


        return IdeaCreateResponseDto.builder()
                .ideaId(idea.getId())
                .serviceName(idea.getServiceName())
                .background(idea.getBackground())
                .introduction(idea.getIntroduction())
                .target(idea.getTarget())
                .expectedEffect(idea.getExpectedEffect())
                .techStack(idea.getTechStack())
                .advancedStack(idea.getAdvancedStack())
                .projectTopic(idea.getProjectTopic())
                .x(idea.getX())
                .y(idea.getY())
                .color(idea.getColor())
                .darkColor(idea.getDarkColor())
                .animation(idea.getAnimation())
                .build();

    }
    /*
     * 아이디어 목록 조회
     * return list of ideas
     * */
    public List<IdeaListResponseDto> getIdeas(Long projectId) {
        List<Idea> ideas = ideaRepository.findByProjectId(projectId);

        return ideas.stream()
                .<IdeaListResponseDto>map(idea -> IdeaListResponseDto.builder()
                        .ideaId(idea.getId())
                        .serviceName(idea.getServiceName())
                        .introduction(idea.getIntroduction())
                        .background(idea.getBackground())
                        .target(idea.getTarget())
                        .expectedEffect(idea.getExpectedEffect())
                        .projectTopic(idea.getProjectTopic())
                        .advancedStack(idea.getAdvancedStack())
                        .techStack(idea.getTechStack())
                        .averageRating(idea.getAverageRating())
                        .x(idea.getX())
                        .y(idea.getY())
                        .color(idea.getColor())
                        .darkColor(idea.getDarkColor())
                        .animation(idea.getAnimation())
                        .build())
                .collect(Collectors.toList());

    }
    /*
     * 아이디어 상세 조회
     * return idea detail
     * */
    public IdeaDetailResponseDto getIdeaDetail(Long projectId, Long ideaId) {

        projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException(ErrorType.PROJECT_NOT_FOUND));

        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new BaseException(ErrorType.IDEA_NOT_FOUND));
        // 아이디어에 달린 댓글들 가져오기
        List<Comment> comments = commentRepository.findByIdeaId(ideaId);

        // 댓글 평균 평점 계산 (소수점 둘째자리까지)
        float avgRating = (float) (Math.round(comments.stream()
                .mapToDouble(Comment::getRating)
                .average()
                .orElse(0.0) * 100) / 100.0);

        // 댓글 DTO 변환
        if ( comments.isEmpty() ) {

            return IdeaDetailResponseDto.builder()
                    .ideaId(idea.getId())
                    .serviceName(idea.getServiceName())
                    .introduction(idea.getIntroduction())
                    .background(idea.getBackground())
                    .target(idea.getTarget())
                    .expectedEffect(idea.getExpectedEffect())
                    .projectTopic(idea.getProjectTopic())
                    .advancedStack(idea.getAdvancedStack())
                    .techStack(idea.getTechStack())
                    .averageRating(idea.getAverageRating())
                    .averageRating(avgRating)
                    .comments(null)
                    .build();
        }
        else {
            List<IdeaDetailResponseDto.CommentDto> commentDtos = comments.stream()
                    .<IdeaDetailResponseDto.CommentDto>map(comment -> IdeaDetailResponseDto.CommentDto.builder()
                            .commentId(comment.getId())
                            .rating(comment.getRating())
                            .userId(comment.getUserId())
                            .commentContent(comment.getCommentContent())
                            .createdAt(comment.getCreatedAt())
                            .build())
                    .collect(Collectors.toList());

            return IdeaDetailResponseDto.builder()
                    .ideaId(idea.getId())
                    .serviceName(idea.getServiceName())
                    .introduction(idea.getIntroduction())
                    .background(idea.getBackground())
                    .target(idea.getTarget())
                    .expectedEffect(idea.getExpectedEffect())
                    .projectTopic(idea.getProjectTopic())
                    .advancedStack(idea.getAdvancedStack())
                    .techStack(idea.getTechStack())
                    .averageRating(idea.getAverageRating())
                    .averageRating(avgRating)
                    .comments(commentDtos)
                    .build();
        }
    }

    /*
     * 아이디어 채택
     * @param user 현재 로그인한 사용자 정보
     * @param ideaId 채택할 아이디어 ID
     */
    public void selectIdea(UserDto user, Long ideaId) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new BaseException(ErrorType.IDEA_NOT_FOUND));

        Project project = projectRepository.findById(idea.getProject().getId())
                .orElseThrow(() -> new BaseException(ErrorType.PROJECT_NOT_FOUND));

        // 팀장 권한 체크
        if (!Objects.equals(project.getLeader(), user.getId())) {
            throw new BaseException(ErrorType.NOT_TEAM_LEADER);
        }
        // 메인 아이디어 설정
        project.setMainIdeaId(ideaId);
        projectRepository.save(project);

        // MongoDB에 동일한 프로젝트 ID로 프로젝트 저장
        MongoIdea mongoIdea = new MongoIdea();
        mongoIdea.setId(idea.getId());  // 동일한 ID 설정
        mongoIdea.setErd(mongoIdeaService.getSampleErdDoc());  // 예시 데이터
        mongoIdea.setFlowChart("default flow chart");  // 예시 데이터

        // ApiDocs 생성
        ApiDoc apiDoc = new ApiDoc();
        apiDoc.setId(UUID.nameUUIDFromBytes("1".getBytes()));
        apiDoc.setDomain("example.com");
        apiDoc.setName("Sample API");
        apiDoc.setMethodType(MethodType.GET);
        apiDoc.setApiUrl("/api/sample");
        apiDoc.setRequestHeader("{\"Authorization\": \"Bearer token\"}");
        apiDoc.setRequestParams("{\"id\": \"123\"}");
        apiDoc.setRequestBody("{\"name\": \"example\"}");
        apiDoc.setResponseBody("{\"result\": \"success\"}");
        apiDoc.setApiImportance(ApiImportance.HIGH);
        apiDoc.setBackendManager("John Doe");
        apiDoc.setFrontendManager("Jane Doe");

        ApiDocs apiDocs = ApiDocs.builder()
                .apiBaseUrl("https://example.com/api")
                .apiDocList(List.of(apiDoc))
                .build();

        mongoIdea.setApiDocs(apiDocs);

        // ReqDocs 생성
        ReqDoc reqDoc = new ReqDoc();
        reqDoc.setId(UUID.nameUUIDFromBytes("1".getBytes()));
        reqDoc.setStatus(Status.INCOMPLETE);
        reqDoc.setRelatedPage("sample-page.html");
        reqDoc.setIsRequired(IsRequired.ESSENTIAL);
        reqDoc.setName("Sample Requirement");
        reqDoc.setDescription("This is a sample requirement for demonstration.");
        reqDoc.setAuthor("Jane Developer");

        ReqDocs reqDocs = ReqDocs.builder()
                .reqDocList(List.of(reqDoc))
                .build();

        mongoIdea.setReqDocs(reqDocs);

        // Proposal 생성
        mongoIdea.setProposal("This is a default proposal for the project.");

        // MongoDB에 저장
        mongoIdeaRepository.save(mongoIdea);
    }

    /*
     * 아이디어 채택 취소
     * @param user 현재 로그인한 사용자 정보
     * @param ideaId 채택 취소할 아이디어 ID
     */
    public void unselectIdea(UserDto user, Long ideaId) {

        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new BaseException(ErrorType.IDEA_NOT_FOUND));

        // 메인 아이디어 취소
        Project project = projectRepository.findById(idea.getProject().getId())
                .orElseThrow(() -> new BaseException(ErrorType.PROJECT_NOT_FOUND));

        // 팀장 권한 체크
        if (!Objects.equals(project.getLeader(), user.getId())) {
            throw new BaseException(ErrorType.NOT_TEAM_LEADER);
        }

        // 아이디어가 비어있는지 확인
        if (project.getMainIdeaId() == null) {
            throw new BaseException(ErrorType.IDEA_NOT_EMPTY);
        }

        // 메인 아이디어 취소
        project.setMainIdeaId(null);
        projectRepository.save(project);
    }

    /*
     * 아이디어 수정
     * return updated idea
     * @param user 현재 로그인한 사용자 정보
     * @param ideaId 수정할 아이디어 ID
     * @param dto 수정할 아이디어 정보
     */
    public IdeaUpdateResponseDto updateIdea(UserDto user, Long ideaId, IdeaUpdateRequestDto dto) {

        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new BaseException(ErrorType.IDEA_NOT_FOUND));

        // 프로젝트 ID 가져오기
        Long projectId = idea.getProject().getId();

        // 해당 프로젝트의 팀원이 아닐 경우 오류 발생
        checkUserInProject(user, projectId);

        // 수정 후 아이디어 정보 저장
        IdeaUpdateResponseDto responseDto = IdeaUpdateResponseDto.builder()
                .ideaId(idea.getId())
                .serviceName(idea.getServiceName())
                .introduction(idea.getIntroduction())
                .background(idea.getBackground())
                .target(idea.getTarget())
                .expectedEffect(idea.getExpectedEffect())
                .projectTopic(idea.getProjectTopic())
                .advancedStack(idea.getAdvancedStack())
                .techStack(idea.getTechStack())
                .x(dto.getX())
                .y(dto.getY())
                .color(dto.getColor())
                .darkColor(dto.getDarkColor())
                .animation(dto.getAnimation())
                .build();

        // dto의 내용으로 아이디어 업데이트
        idea.updateIdea(dto);

        // 저장
        ideaRepository.save(idea);

        // ResponseDto 생성 및 반환
        return responseDto;
    }

    /*
     * 아이디어 삭제
     * return deleted idea
     * @param user 현재 로그인한 사용자 정보
     * @param ideaId 삭제할 아이디어 ID
     */
    public void deleteIdea(UserDto user, Long ideaId) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new BaseException(ErrorType.IDEA_NOT_FOUND));

        // 프로젝트 ID 가져오기
        Long projectId = idea.getProject().getId();

        // 해당 프로젝트의 팀원이 아닐 경우 오류 발생
        checkUserInProject(user, projectId);

        // 1. 먼저 연관된 댓글들을 삭제
        commentRepository.deleteByIdeaId(ideaId);

        // 2. 프로젝트의 메인 아이디어였다면 null로 설정
        Project project = idea.getProject();
        if (project.getMainIdeaId() != null && project.getMainIdeaId().equals(ideaId)) {
            project.setMainIdeaId(null);
            projectRepository.save(project);
        }

        // 3. 마지막으로 아이디어 삭제
        ideaRepository.delete(idea);
    }

    // 해당 프로젝트의 팀원이 아닐 경우 오류 발생 메서드
    public void checkUserInProject(UserDto user, Long projectId) {
        boolean isUserInProject = userProjectRepository.existsByUserIdAndProject_Id(user.getId(), projectId);
        if (!isUserInProject) {
            throw new BaseException(ErrorType.NO_PERMISSION);
        }
    }
}
