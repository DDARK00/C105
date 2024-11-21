package com.ssafy.project_service.mongodb.controller;

import com.ssafy.project_service.common.exception.ApiResponse;
import com.ssafy.project_service.mongodb.entity.LiveFlowChart;
import com.ssafy.project_service.mongodb.entity.apiDoc.*;
import com.ssafy.project_service.mongodb.entity.reqDoc.UpdateReqDoc;
import com.ssafy.project_service.mongodb.service.MongoIdeaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/mongo")
public class MongoIdeaController {

    private final MongoIdeaService mongoIdeaService;

    /**
     *기획서 정보 조회
     **/
    @GetMapping("/{ideaId}/proposal")
    public ApiResponse<String> findIdeaProposal(
            @PathVariable(name = "ideaId") Long ideaId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.findIdeaProposal(ideaId)
        );
    }

    /**
     * 기획서 업데이트
     **/
    @PutMapping("/{ideaId}/proposal")
    public ApiResponse<String> changeIdeaProposal(
            @PathVariable(name = "ideaId") Long ideaId,
            @Valid @RequestBody String updateIdeaProposal
    ) {
        return ApiResponse.ok(
                mongoIdeaService.updateIdeaProposal(ideaId, updateIdeaProposal)
        );
    }

    /**
     * 기획서 Liveblocks 연동
     **/
    @PostMapping("/{projectId}/{ideaId}/proposal/live")
    public ApiResponse<String> liveUpdateIdeaProposal(
            @PathVariable(name = "ideaId") Long projectId,
            @PathVariable(name = "ideaId") Long ideaId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.liveUpdateIdeaProposal(projectId, ideaId)
        );
    }

    /**
     * 프로젝트 ERD 조회
     **/
    @GetMapping("/{ideaId}/erd")
    public ApiResponse<Object> findIdeaErd(
            @PathVariable(name = "ideaId") Long ideaId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.findIdeaErd(ideaId)
        );
    }

    /**
     * 프로젝트 ERD 업데이트
     **/
    @PutMapping("/{ideaId}/erd")
    public ApiResponse<Object> changeIdeaErd(
            @PathVariable(name = "ideaId") Long ideaId,
            @RequestBody Object erdDoc
    ) {
        return ApiResponse.ok(
                mongoIdeaService.changeIdeaErd(ideaId, erdDoc)
        );
    }
    /**
     * liveblock 프로젝트 ERD 업데이트
     **/
    @PostMapping("/{projectId}/{ideaId}/erd/live")
    public ApiResponse<Object> changeIdeaErdWithLiveblocks(
            @PathVariable Long projectId,
            @PathVariable Long ideaId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.liveIdeaErd(projectId, ideaId)
        );
    }


    /**
     * 프로젝트 API 명세서 등록 / 업데이트
     **/
    @PostMapping("/{ideaId}/api-docs")
    public ApiResponse<String> insertIdeaApiDoc(
            @PathVariable Long ideaId,
            @RequestBody UpdateApiDoc updateApiDoc
    ) {
        return ApiResponse.ok(
                mongoIdeaService.updateIdeaApiDoc(ideaId, updateApiDoc)
        );
    }

    /**
     * 프로젝트 API 명세서 상세 조회
     **/
    @GetMapping("/{ideaId}/api-docs/{apiDocId}")
    public ApiResponse<GetApiDoc> findIdeaSingleApiDoc(
            @PathVariable Long ideaId,
            @PathVariable String apiDocId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.findIdeaSingleApiDocs(ideaId, UUID.fromString(apiDocId))
        );
    }

    /**
     * 프로젝트 API 명세서 목록 조회
     **/
    @GetMapping("/{ideaId}/api-docs")
    public ApiResponse<List<GetSimpleApiDoc>> findIdeaApiDocs(
            @PathVariable Long ideaId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.findIdeaApiDocs(ideaId)
        );
    }

    /**
     * 프로젝트 API 명세서 삭제
     **/
    @DeleteMapping("/{ideaId}/api-docs/{apiDocId}")
    public ApiResponse<String> deleteIdeaApiDoc(
            @PathVariable Long ideaId,
            @PathVariable String apiDocId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.deleteIdeaApiDoc(ideaId, UUID.fromString(apiDocId))
        );
    }

    /**
     * 프로젝트 요구사항 명세서 등록 / 업데이트
     **/
    @PostMapping("/{ideaId}/req-docs")
    public ApiResponse<String> insertIdeaReqDoc(
            @PathVariable Long ideaId,
            @RequestBody UpdateReqDoc updateReqDoc
    ) {
        return ApiResponse.ok(
                mongoIdeaService.updateIdeaReqDoc(ideaId, updateReqDoc)
        );
    }

    /**
     * 프로젝트 요구사항 명세서 상세 조회
     **/
    @GetMapping("/{ideaId}/req-docs/{reqDocId}")
    public ApiResponse<GetReqDoc> findIdeaSingleReqDoc(
            @PathVariable Long ideaId,
            @PathVariable String reqDocId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.findIdeaSingleReqDocs(ideaId, UUID.fromString(reqDocId))
        );
    }

    /**
     * 프로젝트 요구 사항 명세서 목록 조회
     **/
    @GetMapping("/{ideaId}/req-docs")
    public ApiResponse<List<GetSimpleReqDoc>> findIdeaReqDocs(
            @PathVariable Long ideaId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.findIdeaReqDocs(ideaId)
        );
    }

    /**
     * 프로젝트 요구 사항 명세서 삭제
     **/
    @DeleteMapping("/{ideaId}/req-docs/{reqDocId}")
    public ApiResponse<String> deleteIdeaReqDoc(
            @PathVariable Long ideaId,
            @PathVariable String reqDocId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.deleteIdeaReqDoc(ideaId, UUID.fromString(reqDocId))
        );
    }

    @PostMapping("/{projectId}/{ideaId}/req-docs/live")
    public ApiResponse<List<GetSimpleReqDoc>> liveIdeaRecDoc(
            @PathVariable Long projectId,
            @PathVariable Long ideaId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.liveIdeaReqDoc(projectId, ideaId)
        );
    }

    /**
     * Liveblocks 프로젝트 Flow Chart 업데이트
     **/
    @PostMapping("/{projectId}/{ideaId}/flow-chart/live")
    public ApiResponse<LiveFlowChart> liveUpdateIdeaFlowChart(
            @PathVariable Long projectId,
            @PathVariable Long ideaId
    ) {
        return ApiResponse.ok(
                mongoIdeaService.liveUpdateIdeaFlowChart(projectId, ideaId)
        );
    }

}
