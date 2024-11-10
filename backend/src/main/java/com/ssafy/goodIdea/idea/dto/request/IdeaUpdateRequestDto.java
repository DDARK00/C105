package com.ssafy.goodIdea.idea.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdeaUpdateRequestDto {
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
