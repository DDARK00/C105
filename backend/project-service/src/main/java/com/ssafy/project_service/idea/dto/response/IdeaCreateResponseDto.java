package com.ssafy.project_service.idea.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class IdeaCreateResponseDto {
    private Long ideaId;
    private String serviceName;
    private String background;
    private String introduction;
    private String target;
    private String expectedEffect;
    private String projectTopic;
    private String techStack;
    private String advancedStack;
    private float averagRating;
    private String x;
    private String y;
    private String color;
    private String darkColor;
    private String animation;
}

