package com.ssafy.project_service.idea.dto.response;

import lombok.Getter;
import lombok.Builder;

@Getter
@Builder
public class IdeaListResponseDto {
    private Long ideaId;
    private String serviceName;
    private String introduction;
    private float averageRating;
}

