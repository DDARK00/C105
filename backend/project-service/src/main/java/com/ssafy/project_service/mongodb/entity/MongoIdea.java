package com.ssafy.project_service.mongodb.entity;

import com.ssafy.project_service.mongodb.entity.apiDoc.ApiDocs;
import com.ssafy.project_service.mongodb.entity.reqDoc.ReqDocs;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;


@Getter
@Setter
@Document(collection = "ideas")
public class MongoIdea {
    @Id
    @Field("idea_id")
    private Long id;
    @Field("idea_erd")
    private Object erd;
    @Field("idea_flow_chart")
    private String flowChart;
    @Field("idea_api_doc")
    private ApiDocs apiDocs;
    @Field("idea_req_doc")
    private ReqDocs reqDocs;
    @Field("idea_proposal")
    private String proposal;
}
