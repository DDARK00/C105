package com.ssafy.project_service.mongodb.entity.apiDoc;


import lombok.Builder;

import java.util.UUID;

@Builder
public record GetSimpleApiDoc (
    UUID id,
    String domain,
    String name,
    MethodType methodType,
    String apiUrl,
    String requestHeader,
    String requestParams,
    String requestBody,
    String responseBody,
    ApiImportance apiImportance,
    String backendManager,
    String frontendManager
) {
    public static GetSimpleApiDoc of(ApiDoc apiDoc) {
        return GetSimpleApiDoc.builder()
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
