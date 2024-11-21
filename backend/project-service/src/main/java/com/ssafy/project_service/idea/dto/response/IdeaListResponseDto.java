package com.ssafy.project_service.idea.dto.response;

import lombok.Getter;
import lombok.Builder;

@Getter
@Builder
public class IdeaListResponseDto {
    private Long ideaId;
    private String serviceName;
    private String background;
    private String introduction;
    private String target;
    private String expectedEffect;
    private String projectTopic;
    private String techStack;
    private String advancedStack;
    private float averageRating;
    private String x;
    private String y;
    private String color;
    private String darkColor;
    private String animation;
}


