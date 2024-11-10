package com.ssafy.goodIdea.idea.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class IdeaUpdateResponseDto {
    private Long ideaId;
    private String serviceName;
    private String background;
    private String introduction;
    private String target;
    private String expectedEffect;
    private String x;
    private String y;
    private String color;
    private String darkColor;
    private String animation;
}
