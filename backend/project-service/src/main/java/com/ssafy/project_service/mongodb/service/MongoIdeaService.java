package com.ssafy.project_service.mongodb.service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.ssafy.project_service.common.exception.BaseException;
import com.ssafy.project_service.common.exception.ErrorType;
import com.ssafy.project_service.liveblocks.application.LiveblocksComponent;
import com.ssafy.project_service.liveblocks.entity.StepName;
import com.ssafy.project_service.mongodb.entity.*;
import com.ssafy.project_service.mongodb.entity.apiDoc.*;
import com.ssafy.project_service.mongodb.entity.reqDoc.LiveReqDetail;
import com.ssafy.project_service.mongodb.entity.reqDoc.ReqDoc;
import com.ssafy.project_service.mongodb.entity.reqDoc.UpdateReqDoc;
import com.ssafy.project_service.mongodb.repository.MongoIdeaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Log4j2
public class MongoIdeaService {

    private final MongoTemplate mongoTemplate;
    private final Gson gson;
    private final MongoIdeaRepository mongoIdeaRepository;
    private final LiveblocksComponent liveblocksComponent;
    private final ObjectMapper objectMapper;

    /**
     * 기획서 조회
     **/
    @Transactional(readOnly = true)
    public String findIdeaProposal(Long ideaId) {
        var idea = mongoIdeaRepository.findProposalById(ideaId).orElseThrow(() ->
                new BaseException(ErrorType.IDEA_NOT_FOUND));
        return idea.getProposal();
    }

    /**
     *  liveblock 기획서 조회
     **/
    public String liveUpdateIdeaProposal(Long projectId, Long ideaId) {
        String proposal = liveblocksComponent.getRoomStorageDocument(projectId.toString(), ideaId.toString(), StepName.PLAN, String.class);
        mongoIdeaRepository.updateProposal(ideaId, proposal);
        return proposal;
    }

    /**
     * 기획서 업데이트
     **/
    @Transactional
    public String updateIdeaProposal(Long ideaId, String updateIdeaProposal) {
        mongoIdeaRepository.updateProposal(ideaId,
                updateIdeaProposal);
        return findIdeaProposal(ideaId);
    }


    /**
     * 프로젝트 ERD 정보
     **/
    public Object findIdeaErd(Long ideaId) {
        var idea = mongoIdeaRepository.findErdById(ideaId).orElseThrow(() ->
                new BaseException(ErrorType.PROJECT_NOT_FOUND));

        if (Objects.isNull(idea.getErd())) {
            Object sampleErd = getSampleErdDoc();
            Query query = new Query(Criteria.where("_id").is(ideaId));
            Update update = new Update().set("idea_erd", sampleErd);
            mongoTemplate.updateFirst(query, update, MongoIdea.class);
            return sampleErd;
        }

        return idea.getErd();
    }

    /**
     * 프로젝트 ERD 업데이트
     **/
    @Transactional
    public Object changeIdeaErd(Long ideaId, Object erdDoc) {
        var project = mongoIdeaRepository.findErdById(ideaId).orElseThrow(() ->
                new BaseException(ErrorType.PROJECT_NOT_FOUND));

        Query query = new Query(Criteria.where("_id").is(ideaId));
        Update update = new Update().set("idea_erd", erdDoc);
        mongoTemplate.updateFirst(query, update, MongoIdea.class);

        return erdDoc;
    }

    /**
     *  liveblock ERD 조회
     **/
    @Transactional
    public Object liveIdeaErd(Long projectId, Long ideaId) {
        var erdDoc = liveblocksComponent.getRoomStorageDocument(projectId.toString(), ideaId.toString(), StepName.ERD, Object.class);
        if (Objects.isNull(erdDoc)) {
            return null;
        }
        try {
            String data = ((LinkedHashMap<?, ?>) erdDoc).get("json").toString();
            if (data.isEmpty()) {
                data = "{\"json\":\"\"}";
            }
            return changeIdeaErd(ideaId, objectMapper.readValue(data, Object.class));
        } catch (JsonProcessingException e) {
            throw new BaseException(ErrorType.JSON_PARSE_ERROR);
        }
    }

    /**
     * 프로젝트 API 명세서 정보 업데이트
     **/
    public String updateIdeaApiDoc(Long ideaId, UpdateApiDoc updateApiDoc) {
        ApiDoc apiDoc = UpdateApiDoc.toApiDoc(updateApiDoc);
        Query query = new Query(Criteria.where("_id").is(ideaId));
        // id가 없으면 save 수행
        if (Objects.isNull(apiDoc.getId())) {
            apiDoc.setId(UUID.randomUUID()); // id setting
            Update update = new Update().addToSet("idea_api_doc.api_docs", apiDoc);
            mongoTemplate.updateFirst(query, update, MongoIdea.class);
            return apiDoc.getId().toString();
        }
        // update 수행
        query.addCriteria(Criteria.where("idea_api_doc.api_docs.api_doc_id").is(apiDoc.getId()));
        Update update = new Update().set("idea_api_doc.api_docs.$", apiDoc);
        mongoTemplate.updateFirst(query, update, MongoIdea.class);
        return updateApiDoc.id().toString();
    }

    /**
     * 프로젝트 API 명세서 정보 삭제
     **/
    public String deleteIdeaApiDoc(Long ideaId, UUID apiDocId) {
        Query query = new Query(Criteria.where("_id").is(ideaId));
        Update update = new Update().pull("idea_api_doc.api_docs", Query.query(Criteria.where("api_doc_id").is(apiDocId)));
        var result = mongoTemplate.updateFirst(query, update, MongoIdea.class);

        if (result.wasAcknowledged() && result.getModifiedCount() > 0) {
            return "삭제 성공";
        }

        return "삭제 실패";
    }

    /**
     * API DOC 조회
     **/
    public GetApiDoc findIdeaSingleApiDocs(
            Long ideaId, UUID apiDocId
    ) {
        ApiDoc apiDoc = getIdeaApiDoc(ideaId, apiDocId);

        return GetApiDoc.of(apiDoc);
    }

    /**
     * API DOC 조회
     **/
    private ApiDoc getIdeaApiDoc(Long ideaId, UUID apiDocId) {
        Query query = new Query().addCriteria(Criteria.where("_id").is(ideaId));
        query.fields().include("idea_api_doc.api_docs.$");
        query.addCriteria(Criteria.where("idea_api_doc.api_docs.api_doc_id").is(apiDocId));

        MongoIdea idea = mongoTemplate.findOne(query, MongoIdea.class);

        if (idea == null || idea.getApiDocs() == null || idea.getApiDocs().getApiDocList().isEmpty()) {
            throw new BaseException(ErrorType.NOT_FOUND_API_DOC);
        }

        return idea.getApiDocs().getApiDocList().get(0);
    }

    /**
     * API 명세서 리스트 정보
     **/
    @Transactional(readOnly = true)
    public List<GetSimpleApiDoc> findIdeaApiDocs(Long ideaId) {
        var idea = mongoIdeaRepository.findIdeaApiDocs(ideaId).orElseThrow(() ->
                new BaseException(ErrorType.IDEA_NOT_FOUND));

        if (Objects.isNull(idea.getApiDocs()) || Objects.isNull(idea.getApiDocs().getApiDocList())) {
            return List.of();
        }

        var apiDocs = idea.getApiDocs().getApiDocList();
        return apiDocs.stream().map(GetSimpleApiDoc::of).toList();
    }


    /**
     * 프로젝트 요구 사항 명세서 정보 업데이트
     **/
    public String updateIdeaReqDoc(Long ideaId, UpdateReqDoc updateReqDoc) {
        ReqDoc reqDoc = UpdateReqDoc.toReqDoc(updateReqDoc);
        Query query = new Query(Criteria.where("_id").is(ideaId));
        // id가 없으면 save 수행
        if (Objects.isNull(reqDoc.getId())) {
            reqDoc.setId(UUID.randomUUID()); // id setting
            Update update = new Update().addToSet("idea_req_doc.req_docs", reqDoc);
            mongoTemplate.updateFirst(query, update, MongoIdea.class);
            return reqDoc.getId().toString();
        }
        // update 수행
        query.addCriteria(Criteria.where("idea_req_doc.req_docs.req_doc_id").is(reqDoc.getId()));
        Update update = new Update().set("idea_req_doc.req_docs.$", reqDoc);
        mongoTemplate.updateFirst(query, update, MongoIdea.class);
        return updateReqDoc.id().toString();
    }

    /**
     * 프로젝트 요구 사항 명세서 정보 삭제
     **/
    public String deleteIdeaReqDoc(Long ideaId, UUID reqDocId) {
        Query query = new Query(Criteria.where("_id").is(ideaId));
        Update update = new Update().pull("idea_req_doc.req_docs", Query.query(Criteria.where("req_doc_id").is(reqDocId)));
        var result = mongoTemplate.updateFirst(query, update, MongoIdea.class);

        if (result.wasAcknowledged() && result.getModifiedCount() > 0) {
            return "삭제 성공";
        }

        return "삭제 실패";
    }

    /**
     * Req DOC 조회
     **/
    public GetReqDoc findIdeaSingleReqDocs(
            Long ideaId, UUID reqDocId
    ) {
        ReqDoc reqDoc = getIdeaReqDoc(ideaId, reqDocId);

        return GetReqDoc.of(reqDoc);
    }

    /**
     * Req DOC 조회
     **/
    private ReqDoc getIdeaReqDoc(Long ideaId, UUID reqDocId) {
        Query query = new Query().addCriteria(Criteria.where("_id").is(ideaId));
        query.fields().include("idea_req_doc.req_docs.$");
        query.addCriteria(Criteria.where("idea_req_doc.req_docs.req_doc_id").is(reqDocId));

        MongoIdea idea = mongoTemplate.findOne(query, MongoIdea.class);

        if (idea == null || idea.getReqDocs() == null || idea.getReqDocs().getReqDocList().isEmpty()) {
            throw new BaseException(ErrorType.NOT_FOUND_REQ_DOC);
        }

        return idea.getReqDocs().getReqDocList().get(0);
    }

    /**
     * 요구 사항 명세서 리스트 정보
     **/
    @Transactional(readOnly = true)
    public List<GetSimpleReqDoc> findIdeaReqDocs(Long ideaId) {
        var idea = mongoIdeaRepository.findIdeaReqDocs(ideaId).orElseThrow(() ->
                new BaseException(ErrorType.IDEA_NOT_FOUND));

        if (Objects.isNull(idea.getReqDocs()) || Objects.isNull(idea.getReqDocs().getReqDocList())) {
            return List.of();
        }

        var reqDocs = idea.getReqDocs().getReqDocList();
        return reqDocs.stream().map(GetSimpleReqDoc::of).toList();
    }

    public List<GetSimpleReqDoc> liveIdeaReqDoc(Long projectId, Long ideaId) {
        System.out.println(StepName.REQ.getRoomName());
    List<LiveReqDetail> liveReqDto = liveblocksComponent.getRoomStorageDocuments(projectId.toString(), ideaId.toString(), StepName.REQ, LiveReqDetail.class);
        List<ReqDoc> reqDocs = new ArrayList<>();
        for (LiveReqDetail liveReqDetail : liveReqDto) {
            try {
                reqDocs.add(LiveReqDetail.toReqDoc(liveReqDetail));
            } catch (Exception e) {
                if (e instanceof BaseException) {
                    log.info(e.getMessage());
                }
                log.trace(liveReqDetail.name() + " APIListDetail 파싱 실패!");
            }
        }

        Query query = new Query(Criteria.where("_id").is(ideaId));
        Update update = new Update().set("idea_req_doc.req_docs", reqDocs);
        var result = mongoTemplate.updateFirst(query, update, MongoIdea.class);
        if (result.wasAcknowledged() && (result.getMatchedCount() > 0 || result.getModifiedCount() > 0)) {
            return reqDocs.stream().map(GetSimpleReqDoc::of).toList();
        }
        throw new BaseException(ErrorType.FAILED_TO_UPDATE_API_DOCS);
    }

    public LiveFlowChart liveUpdateIdeaFlowChart(Long projectId, Long ideaId) {
        LiveFlowChart liveFlowChart = liveblocksComponent.getRoomStorageDocument(projectId.toString(), ideaId.toString(), StepName.FLOW, LiveFlowChart.class);
        if (Objects.isNull(liveFlowChart)) {
            return null;
        }
        return mongoIdeaRepository.updateFlowChart(ideaId, liveFlowChart);
    }







    /**
     * Erd 기본 Schema 정보
     **/
    public Object getSampleErdDoc() {
        String json = """
                {
                   "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
                   "version": "3.0.0",
                   "settings": {
                     "width": 2000,
                     "height": 2000,
                     "scrollTop": 0,
                     "scrollLeft": 0,
                     "zoomLevel": 1,
                     "show": 431,
                     "database": 4,
                     "databaseName": "",
                     "canvasType": "ERD",
                     "language": 1,
                     "tableNameCase": 4,
                     "columnNameCase": 2,
                     "bracketType": 1,
                     "relationshipDataTypeSync": true,
                     "relationshipOptimization": false,
                     "columnOrder": [
                       1,
                       2,
                       4,
                       8,
                       16,
                       32,
                       64
                     ],
                     "maxWidthComment": -1,
                     "ignoreSaveSettings": 0
                   },
                   "doc": {
                     "tableIds": [],
                     "relationshipIds": [],
                     "indexIds": [],
                     "memoIds": []
                   },
                   "collections": {
                     "tableEntities": {},
                     "tableColumnEntities": {},
                     "relationshipEntities": {},
                     "indexEntities": {},
                     "indexColumnEntities": {},
                     "memoEntities": {}
                   },
                   "lww": {}
                }
                """;
        return gson.fromJson(json, Object.class);
    }
}
