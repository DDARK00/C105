package com.ssafy.project_service.mongodb.entity.apiDoc;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.UUID;

@Builder
public record GetApiDoc(
        @Schema(description = "id")
        UUID id,
        @Schema(description = "api_domain")
        String domain,
        @Schema(description = "api_name")
        String name,
        @Schema(description = "method_type")
        MethodType methodType,
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
        @Schema(description = "api_importance_level")
        ApiImportance apiImportance,
        @Schema(description = "be_manager")
        String backendManager,
        @Schema(description = "fe_manager")
        String frontendManager
) {

    public static GetApiDoc of(ApiDoc apiDoc) {
        return GetApiDoc.builder()
                .id(apiDoc.getId())
                .domain(apiDoc.getDomain())
                .name(apiDoc.getName())
                .methodType(apiDoc.getMethodType())
                .apiUrl(apiDoc.getApiUrl())
                .requestHeader(apiDoc.getRequestHeader())
                .requestParams(apiDoc.getRequestParams())
                .requestBody(apiDoc.getRequestBody())
                .responseBody(apiDoc.getResponseBody())
                .apiImportance(apiDoc.getApiImportance())
                .backendManager(apiDoc.getBackendManager())
                .frontendManager(apiDoc.getFrontendManager())
                .build();
    }
}