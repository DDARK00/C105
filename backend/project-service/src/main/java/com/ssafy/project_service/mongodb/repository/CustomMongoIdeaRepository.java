package com.ssafy.project_service.mongodb.repository;

import com.ssafy.project_service.mongodb.entity.LiveFlowChart;
import org.bson.types.ObjectId;



public interface CustomMongoIdeaRepository {


    LiveFlowChart updateFlowChart(Long ideaId, LiveFlowChart liveFlowChart);
}