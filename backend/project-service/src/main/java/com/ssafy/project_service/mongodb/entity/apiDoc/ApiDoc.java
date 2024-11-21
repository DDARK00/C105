package com.ssafy.project_service.mongodb.entity.apiDoc;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.UUID;

@Getter
@Setter
public class ApiDoc {
    @Field("api_doc_id")
    private UUID id;
    @Field("api_domain")
    private String domain;
    @Field("api_name")
    private String name;
    @Field("api_method_type")
    private MethodType methodType;
    @Field("api_url")
    private String apiUrl;
    @Field("request_header")
    private String requestHeader;
    @Field("request_params")
    private String requestParams;
    @Field("request_body")
    private String requestBody;
    @Field("response_body")
    private String responseBody;
    @Field("api_importance")
    private ApiImportance apiImportance;
    @Field("api_be_manager")
    private String backendManager;
    @Field("api_fe_manager")
    private String frontendManager;


}
