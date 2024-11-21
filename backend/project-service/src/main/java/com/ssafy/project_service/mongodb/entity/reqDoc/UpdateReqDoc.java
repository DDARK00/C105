package com.ssafy.project_service.mongodb.entity.reqDoc;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.UUID;

@Builder
public record UpdateReqDoc(
        @Schema(description = "id")
        UUID id,
        @Schema(description = "req_status")
        Status status,
        @Schema(description = "req_related_page")
        String relatedPage,
        @NotNull
        @Schema(description = "req_is_required")
        IsRequired isRequired,
        @NotBlank
        @Schema(description = "req_name")
        String name,
        @Schema(description = "req_description")
        String description,
        @NotBlank
        @Schema(description = "req_author")
        String author
) {
    public static ReqDoc toReqDoc(UpdateReqDoc updateReqDoc) {
        ReqDoc reqDoc = new ReqDoc();
        reqDoc.setId(updateReqDoc.id());
        reqDoc.setStatus(updateReqDoc.status());
        reqDoc.setRelatedPage(updateReqDoc.relatedPage());
        reqDoc.setIsRequired(updateReqDoc.isRequired());
        reqDoc.setName(updateReqDoc.name());
        reqDoc.setDescription(updateReqDoc.description());
        reqDoc.setAuthor(updateReqDoc.author());
        return reqDoc;
    }
}