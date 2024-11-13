package com.ssafy.project_service.idea.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IdeaCreateRequestDto {
    private String serviceName; // 서비스 이름
    private String background; // 기획 배경
    private String introduction; // 서비스 소개
    private String target; // 서비스 타겟
    private String expectedEffect; // 기대효과
    private String x; // x좌표
    private String y; // y좌표
    private String color; // 색상
    private String darkColor; // 어두운 색상
    private String animation; // 애니메이션
}

