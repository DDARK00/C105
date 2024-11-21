package com.ssafy.project_service.mongodb.entity.reqDoc;


import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.UUID;

@Getter
@Setter
public class ReqDoc {
    @Field("req_doc_id")
    private UUID id;
    @Field("req_status")
    private Status status;
    @Field("req_related_page")
    private String relatedPage;
    @Field("req_is_required")
    private IsRequired isRequired;
    @Field("req_name")
    private String name;
    @Field("req_description")
    private String description;
    @Field("req_author")
    private String author;

}
