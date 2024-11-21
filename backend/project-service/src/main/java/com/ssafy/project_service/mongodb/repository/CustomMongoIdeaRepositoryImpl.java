package com.ssafy.project_service.mongodb.repository;


import com.ssafy.project_service.common.exception.BaseException;
import com.ssafy.project_service.common.exception.ErrorType;
import com.ssafy.project_service.common.util.StringParserUtil;
import com.ssafy.project_service.mongodb.entity.LiveFlowChart;
import com.ssafy.project_service.mongodb.entity.MongoIdea;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@RequiredArgsConstructor
public class CustomMongoIdeaRepositoryImpl implements CustomMongoIdeaRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public LiveFlowChart updateFlowChart(Long ideaId, LiveFlowChart liveFlowChart) {
        var pretty = StringParserUtil.formatMermaid(liveFlowChart.json());
        Query query = new Query(Criteria.where("_id").is(ideaId));
        Update update = new Update().set("idea_flow_chart", pretty);

        var result = mongoTemplate.updateFirst(query, update, MongoIdea.class);
        if (result.wasAcknowledged() && result.getMatchedCount() + result.getModifiedCount() > 0) {
            return new LiveFlowChart(pretty);
        }
        throw new BaseException(ErrorType.FAILED_TO_UPDATE_FLOWCHART);
    }

}
