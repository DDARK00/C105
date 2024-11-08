package com.ssafy.goodIdea.planner.dto.response;

import com.ssafy.goodIdea.planner.entity.Planner;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class PlannerResponseDto {
    private Long ideaId;
    private String content;

    public static PlannerResponseDto from(Planner planner) {
        return PlannerResponseDto.builder()
            .ideaId(planner.getIdea().getId())
            .content(planner.getContent())
            .build();
    }
} 