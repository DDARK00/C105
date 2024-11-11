package com.ssafy.goodIdea.planner.controller;

import com.ssafy.goodIdea.planner.dto.response.PlannerUpdateResponseDto;
import com.ssafy.goodIdea.planner.service.PlannerService;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;
import com.ssafy.goodIdea.common.dto.DocumentOperationDto;
import com.ssafy.goodIdea.common.exception.ApiResponse;

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
     * 플래너 수정
     */
    @MessageMapping("/planner/{ideaId}")
    public ApiResponse<PlannerUpdateResponseDto> updatePlanner(@DestinationVariable Long ideaId, DocumentOperationDto operation) {
        PlannerUpdateResponseDto updatedPlanner = plannerService.updateContent(operation);
        return ApiResponse.ok(updatedPlanner);
    }
}