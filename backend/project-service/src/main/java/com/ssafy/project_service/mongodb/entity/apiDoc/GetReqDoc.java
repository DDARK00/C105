package com.ssafy.project_service.mongodb.entity.apiDoc;

import com.ssafy.project_service.mongodb.entity.reqDoc.IsRequired;
import com.ssafy.project_service.mongodb.entity.reqDoc.ReqDoc;
import com.ssafy.project_service.mongodb.entity.reqDoc.Status;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.UUID;

@Builder
public record GetReqDoc(
        @Schema(description = "id")
        UUID id,
        @Schema(description = "req_status")
        Status status,
        @Schema(description = "req_related_page")
        String relatedPage,
        @Schema(description = "req_is_required")
        IsRequired isRequired,
        @Schema(description = "req_name")
        String name,
        @Schema(description = "req_description")
        String description,
        @Schema(description = "req_author")
        String author
) {
    public static GetReqDoc of(ReqDoc reqDoc) {
        return GetReqDoc.builder()
                .id(reqDoc.getId())
                .status(reqDoc.getStatus())
                .relatedPage(reqDoc.getRelatedPage())
                .isRequired(reqDoc.getIsRequired())
                .name(reqDoc.getName())
                .description(reqDoc.getDescription())
                .author(reqDoc.getAuthor())
                .build();
    }
}