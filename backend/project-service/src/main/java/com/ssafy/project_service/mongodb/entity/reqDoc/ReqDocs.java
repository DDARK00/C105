package com.ssafy.project_service.mongodb.entity.reqDoc;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
public class ReqDocs {
    @Builder.Default
    @Field("req_docs")
    private List<ReqDoc> reqDocList = new ArrayList<>();
}
