package com.ssafy.goodIdea.planner.controller;

import com.ssafy.goodIdea.planner.dto.response.PlannerUpdateResponseDto;
import com.ssafy.goodIdea.planner.service.PlannerService;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;
import com.ssafy.goodIdea.common.dto.DocumentOperationDto;
import com.ssafy.goodIdea.common.exception.ApiResponse;
import com.ssafy.goodIdea.common.exception.BaseException;
import com.ssafy.goodIdea.common.exception.ErrorType;

import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/planner")
public class PlannerController {
    private final PlannerService plannerService;

    /*
     * 플래너 조회
     */
    @GetMapping("/{ideaId}")
    public ApiResponse<PlannerUpdateResponseDto> getPlanner(@PathVariable(name = "ideaId") Long ideaId) {
        PlannerUpdateResponseDto planner = plannerService.getPlanner(ideaId);
        return ApiResponse.ok(planner);
    }

    /*
     * 플래너 수정 (WebSocket & HTTP)
     */
    @MessageMapping("/planner/{ideaId}")
    @PutMapping("/{ideaId}")  // PUT 메서드 추가
    public ApiResponse<PlannerUpdateResponseDto> updatePlanner(
        @PathVariable(required = false) Long ideaId,  // HTTP 요청용
        @DestinationVariable Long wsIdeaId,  // WebSocket 요청용
        @RequestBody(required = false) Map<String, String> payload,  // HTTP 요청용
        DocumentOperationDto operation  // WebSocket 요청용
    ) {
        // WebSocket이나 HTTP 요청 구분하여 처리
        if (operation == null && payload != null) {
            // HTTP PUT 요청인 경우
            operation = new DocumentOperationDto();
            operation.setIdeaId(ideaId.toString());
            
            Map<String, Object> data = new HashMap<>();
            data.put("content", payload.get("content"));
            data.put("clientId", UUID.randomUUID().toString());
            data.put("timestamp", System.currentTimeMillis());
            
            try {
                String jsonData = new ObjectMapper().writeValueAsString(data);
                operation.setData(jsonData);
            } catch (JsonProcessingException e) {
                throw new BaseException(ErrorType.SERVER_ERROR);
            }
        }

        PlannerUpdateResponseDto updatedPlanner = plannerService.updateContent(operation);
        return ApiResponse.ok(updatedPlanner);
    }
}