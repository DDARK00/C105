package com.ssafy.goodIdea.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorType {
    
    // Common
    SERVER_ERROR(500, HttpStatus.INTERNAL_SERVER_ERROR, "서버 에러가 발생하였습니다."),
    GITLAB_TOKEN_ERROR(401, HttpStatus.INTERNAL_SERVER_ERROR, "GitLab Token Error 발생."),

    // Authentication, Authorization
    UNAUTHORIZED(401, HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),
    FORBIDDEN(401, HttpStatus.FORBIDDEN, "권한이 없습니다."),
    INVALID_TOKEN(401, HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(401, HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    INVALID_REFRESH_TOKEN(401, HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다."),
    EXPIRED_REFRESH_TOKEN(401, HttpStatus.UNAUTHORIZED, "만료된 리프레시 토큰입니다."),
    ALREADY_AUTHORIZED(400, HttpStatus.BAD_REQUEST, "이미 인증된 사용자입니다."),
    NOT_FOUND_USER(404, HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    INVALID_ACCESS_TOKEN(401, HttpStatus.UNAUTHORIZED, "유효하지 않은 액세스 토큰입니다."),
    ACCESS_DENIED(403, HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),

    // User
    USER_ALREADY_EXISTS(400, HttpStatus.BAD_REQUEST, "이미 존재하는 사용자 이름입니다."),
    USER_NOT_FOUND(404, HttpStatus.BAD_REQUEST, "존재하지 않는 사용자입니다."),

    // Project
    PROJECT_NOT_FOUND(404, HttpStatus.BAD_REQUEST, "존재하지 않는 프로젝트입니다."),
    PROJECT_ALREADY_EXIST(404, HttpStatus.BAD_REQUEST, "이미 존재하는 프로젝트 타입입니다."),
    NOT_TEAM_LEADER(404, HttpStatus.BAD_REQUEST, "프로젝트 팀장이 아닙니다."),
    // MindMap
    MINDMAP_NOT_FOUND(404, HttpStatus.BAD_REQUEST, "존재하지 않는 마인드맵입니다."),
    
    // Idea
    IDEA_NOT_FOUND(404, HttpStatus.BAD_REQUEST, "존재하지 않는 아이디어입니다."),
    COMMENT_NOT_FOUND(404, HttpStatus.BAD_REQUEST, "존재하지 않는 댓글입니다."),
    IDEA_NOT_EMPTY(404, HttpStatus.BAD_REQUEST, "아이디어가 비어있습니다."),
    NO_PERMISSION(404, HttpStatus.BAD_REQUEST, "권한이 없습니다."),
    PLANNER_NOT_FOUND(404, HttpStatus.BAD_REQUEST, "플래너를 찾을 수 없습니다."),
    ;
    
    private final int code;
    private final HttpStatus status;
    private final String message;
}
