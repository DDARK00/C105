package com.ssafy.goodIdea.idea.service;

import java.util.stream.Collectors;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.ssafy.goodIdea.apiDocs.entity.APIDocs;
import com.ssafy.goodIdea.apiDocs.repository.APIDocsRepository;
import com.ssafy.goodIdea.comment.entity.Comment;
import com.ssafy.goodIdea.comment.repository.CommentRepository;
import com.ssafy.goodIdea.common.exception.BaseException;
import com.ssafy.goodIdea.common.exception.ErrorType;
import com.ssafy.goodIdea.erd.entity.ERD;
import com.ssafy.goodIdea.erd.repository.ERDRepository;
import com.ssafy.goodIdea.flowChart.entity.Flowchart;
import com.ssafy.goodIdea.flowChart.repository.FlowChartRepository;
import com.ssafy.goodIdea.idea.dto.request.IdeaCreateRequestDto;
import com.ssafy.goodIdea.idea.dto.request.IdeaUpdateRequestDto;
import com.ssafy.goodIdea.idea.dto.response.IdeaCreateResponseDto;
import com.ssafy.goodIdea.idea.dto.response.IdeaDetailResponseDto;
import com.ssafy.goodIdea.idea.dto.response.IdeaListResponseDto;
import com.ssafy.goodIdea.idea.dto.response.IdeaUpdateResponseDto;
import com.ssafy.goodIdea.idea.entity.Idea;
import com.ssafy.goodIdea.idea.repository.IdeaRepository;
import com.ssafy.goodIdea.planner.entity.Planner;
import com.ssafy.goodIdea.planner.repository.PlannerRepository;
import com.ssafy.goodIdea.project.entity.Project;
import com.ssafy.goodIdea.project.repository.ProjectRepository;
import com.ssafy.goodIdea.reqDocs.entity.ReqDocs;
import com.ssafy.goodIdea.reqDocs.repository.ReqDocsRepository;
import com.ssafy.goodIdea.user.entity.User;
import com.ssafy.goodIdea.userProject.repository.UserProjectRepository;

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
    /*
     * 아이디어 생성
     * return created idea
     * */
    public IdeaCreateResponseDto createIdea(User user, Long projectId, IdeaCreateRequestDto dto) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new BaseException(ErrorType.PROJECT_NOT_FOUND));

        Idea idea = Idea.builder()
            .project(project)
            .serviceName(dto.getServiceName())
            .background(dto.getBackground()) 
            .introduction(dto.getIntroduction())
            .target(dto.getTarget())
            .expectedEffect(dto.getExpectedEffect())
            .x(dto.getX())
            .y(dto.getY())
            .color(dto.getColor())
            .darkColor(dto.getDarkColor())
            .animation(dto.getAnimation())
            .build();

        idea = ideaRepository.save(idea);

        // 기획서 생성
        Planner planner = Planner.builder()
            .idea(idea)
            .content("")
            .build();
        plannerRepository.save(planner);

        // 요구사항 명세서 생성
        ReqDocs reqDocs = ReqDocs.builder()
            .idea(idea)
            .build();
        reqDocsRepository.save(reqDocs);

        // API 명세서 생성
        APIDocs apiDocs = APIDocs.builder()
            .idea(idea)
            .build();
        apiDocsRepository.save(apiDocs);

        // ERD 생성
        ERD erd = ERD.builder()
            .idea(idea)
            .code("")
            .build();
        erdRepository.save(erd);

        // 플로우차트 생성
        Flowchart flowchart = Flowchart.builder()
            .idea(idea)
            .code("")
            .build();
        flowChartRepository.save(flowchart);

        return IdeaCreateResponseDto.builder()
            .ideaId(idea.getId())
            .serviceName(idea.getServiceName())
            .background(idea.getBackground())
            .introduction(idea.getIntroduction()) 
            .target(idea.getTarget())
            .expectedEffect(idea.getExpectedEffect())
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
        List<IdeaDetailResponseDto.CommentDto> commentDtos = comments.stream()
            .<IdeaDetailResponseDto.CommentDto>map(comment -> IdeaDetailResponseDto.CommentDto.builder()
                .commentId(comment.getId())
                .rating(comment.getRating())
                .userName(comment.getUser().getUsername())
                .commentContent(comment.getCommentContent())
                .createdAt(comment.getCreatedAt())
                .build())
            .collect(Collectors.toList());

        return IdeaDetailResponseDto.builder()
            .ideaId(idea.getId())
            .serviceName(idea.getServiceName())
            .background(idea.getBackground())
            .introduction(idea.getIntroduction())
            .target(idea.getTarget())
            .expectedEffect(idea.getExpectedEffect())
            .averageRating(avgRating)
            .comments(commentDtos)
            .build();
    }

    /*
     * 아이디어 채택
     * @param user 현재 로그인한 사용자 정보
     * @param ideaId 채택할 아이디어 ID
     */
    public void selectIdea(User user, Long ideaId) {
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
    }

    /*
     * 아이디어 채택 취소
     * @param user 현재 로그인한 사용자 정보
     * @param ideaId 채택 취소할 아이디어 ID
     */
    public void unselectIdea(User user, Long ideaId) {

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
    public IdeaUpdateResponseDto updateIdea(User user, Long ideaId, IdeaUpdateRequestDto dto) {

        Idea idea = ideaRepository.findById(ideaId)
            .orElseThrow(() -> new BaseException(ErrorType.IDEA_NOT_FOUND));

        // 프로젝트 ID 가져오기
        Long projectId = idea.getProject().getId();

        // 해당 프로젝트의 팀원이 아닐 경우 오류 발생
        checkUserInProject(user, projectId);

        // 수정 후 아이디어 정보 저장
        IdeaUpdateResponseDto responseDto = IdeaUpdateResponseDto.builder()
                .ideaId(ideaId)
                .serviceName(dto.getServiceName())
                .background(dto.getBackground())
                .introduction(dto.getIntroduction())
                .target(dto.getTarget())
                .expectedEffect(dto.getExpectedEffect())
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
    public void deleteIdea(User user, Long ideaId) {
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
    public void checkUserInProject(User user, Long projectId) {
        boolean isUserInProject = userProjectRepository.existsByUserIdAndProjectId(user.getId(), projectId);
        if (!isUserInProject) {
            throw new BaseException(ErrorType.NO_PERMISSION);
        }
    }
}
