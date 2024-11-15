package com.ssafy.project_service.mongodb.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
public class ApiDocs {
    @Field("api_base_url")
    private String apiBaseUrl;
    @Field("usable_domains")
    private List<String> domains;
    @Builder.Default
    @Field("api_docs")
    private List<ApiDoc> apiDocList = new ArrayList<>();
}