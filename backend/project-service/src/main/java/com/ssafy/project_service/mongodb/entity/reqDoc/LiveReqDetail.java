package com.ssafy.project_service.mongodb.entity.reqDoc;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.project_service.common.exception.BaseException;
import com.ssafy.project_service.common.exception.ErrorType;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.extern.log4j.Log4j2;

import java.util.Set;
import java.util.UUID;

@Log4j2
public record LiveReqDetail(
        @NotNull(message = "id는 필수입니다.")
        @JsonProperty("req_doc_id")
        UUID id,
        @NotNull(message = "status는 필수입니다.")
        @JsonProperty("req_status")
        String status,
        @NotBlank(message = "related_page는 필수입니다.")
        @JsonProperty("req_related_page")
        String relatedPage,
        @NotNull(message = "is_required는 필수입니다.")
        @JsonProperty("req_is_required")
        String isRequired,
        @NotBlank(message = "name은 필수입니다.")
        @JsonProperty("req_name")
        String name,
        @JsonProperty("req_description")
        String description,
        @NotBlank(message = "author는 필수입니다.")
        @JsonProperty("req_author")
        String author
) {
    public static ReqDoc toReqDoc(LiveReqDetail liveReqDetail) {
        if (isValid(liveReqDetail)) {
            ReqDoc reqDoc = new ReqDoc();
            reqDoc.setId(liveReqDetail.id());
            reqDoc.setStatus(Status.valueOf(liveReqDetail.status()));
            reqDoc.setRelatedPage(liveReqDetail.relatedPage());
            reqDoc.setIsRequired(IsRequired.valueOf(liveReqDetail.isRequired()));
            reqDoc.setName(liveReqDetail.name());
            reqDoc.setDescription(liveReqDetail.description());
            reqDoc.setAuthor(liveReqDetail.author());
            return reqDoc;
        }

        return null;
    }

    private static boolean isValid(LiveReqDetail liveReqDetail) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<LiveReqDetail>> violations = validator.validate(liveReqDetail);
        if (!violations.isEmpty()) {
            StringBuilder sb = new StringBuilder();
            for (ConstraintViolation<LiveReqDetail> violation : violations) {
                sb.append(violation.getMessage()).append(", ");
            }
            throw new BaseException(ErrorType.UNABLE_TO_USE_THIS_REQ_DOC);
        }

        return true;
    }
}