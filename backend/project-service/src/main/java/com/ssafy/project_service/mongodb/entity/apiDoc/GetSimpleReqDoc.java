package com.ssafy.project_service.mongodb.entity.apiDoc;


import com.ssafy.project_service.mongodb.entity.reqDoc.IsRequired;
import com.ssafy.project_service.mongodb.entity.reqDoc.ReqDoc;
import com.ssafy.project_service.mongodb.entity.reqDoc.Status;
import lombok.Builder;

import java.util.UUID;

@Builder
public record GetSimpleReqDoc(
        UUID id,
        Status status,
        String relatedPage,
        IsRequired isRequired,
        String name,
        String description,
        String author
) {
    public static GetSimpleReqDoc of(ReqDoc reqDoc) {
        return GetSimpleReqDoc.builder()
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
