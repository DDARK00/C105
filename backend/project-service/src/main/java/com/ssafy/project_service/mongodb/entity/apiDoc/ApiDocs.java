package com.ssafy.project_service.mongodb.entity.apiDoc;

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
    @Builder.Default
    @Field("api_docs")
    private List<ApiDoc> apiDocList = new ArrayList<>();
}