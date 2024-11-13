package com.ssafy.goodIdea.planner.dto.response;

import com.ssafy.goodIdea.planner.entity.Planner;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PlannerResponseDto {
    private Long plannerId;
    private String content;
    private Long ideaId; // Idea 엔티티와 관련된 ID를 저장

    public PlannerResponseDto(Long plannerId, String content, Long ideaId) {
        this.plannerId = plannerId;
        this.content = content;
        this.ideaId = ideaId;
    }

    public static PlannerResponseDto from(Planner planner) {
        return new PlannerResponseDto(
                planner.getId(),
                planner.getContent(),
                planner.getIdea().getId()
        );
    }
}
