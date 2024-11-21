package com.ssafy.project_service.mongodb.entity.apiDoc;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.UUID;

@Builder
public record UpdateApiDoc(
        @Schema(description = "id")
        UUID id,
        @NotBlank
        @Schema(description = "api_domain")
        String domain,
        @NotBlank
        @Schema(description = "api_name")
        String name,
        @NotNull
        @Schema(description = "method_type")
        MethodType methodType,
        @NotBlank
        @Schema(description = "api_url")
        String apiUrl,
        @Schema(description = "request_header")
        String requestHeader,
        @Schema(description = "request_parameters")
        String requestParams,
        @Schema(description = "request_body")
        String requestBody,
        @Schema(description = "response_body")
        String responseBody,
        @NotNull
        @Schema(description = "api_importance_level")
        ApiImportance apiImportance,
        @Schema(description = "be_manager")
        String backendManager,
        @Schema(description = "fe_manager")
        String frontendManager
) {
    public static ApiDoc toApiDoc(UpdateApiDoc updateApiDoc) {
        ApiDoc apiDoc = new ApiDoc();
        apiDoc.setId(updateApiDoc.id());
        apiDoc.setDomain(updateApiDoc.domain());
        apiDoc.setName(updateApiDoc.name());
        apiDoc.setMethodType(updateApiDoc.methodType());
        apiDoc.setApiUrl(updateApiDoc.apiUrl());
        apiDoc.setRequestHeader(updateApiDoc.requestHeader());
        apiDoc.setRequestParams(updateApiDoc.requestParams());
        apiDoc.setRequestBody(updateApiDoc.requestBody());
        apiDoc.setResponseBody(updateApiDoc.responseBody());
        apiDoc.setApiImportance(updateApiDoc.apiImportance());
        apiDoc.setBackendManager(updateApiDoc.backendManager());
        apiDoc.setFrontendManager(updateApiDoc.frontendManager());
        return apiDoc;
    }
}