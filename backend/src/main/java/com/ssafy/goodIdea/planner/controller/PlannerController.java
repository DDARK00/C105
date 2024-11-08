package com.ssafy.goodIdea.planner.controller;

import com.ssafy.goodIdea.planner.dto.response.PlannerResponseDto;
import com.ssafy.goodIdea.planner.service.PlannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import com.ssafy.goodIdea.common.dto.DocumentOperationDto;
import com.ssafy.goodIdea.common.exception.ApiResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/planner")
public class PlannerController {
    private final PlannerService plannerService;
    private final SimpMessagingTemplate messagingTemplate;

    /*
     * 플래너 조회
     */
    @GetMapping("/{ideaId}")
    public ApiResponse<PlannerResponseDto> getPlanner(@PathVariable(name = "ideaId") Long ideaId) {
        PlannerResponseDto planner = plannerService.getPlanner(ideaId);
        return ApiResponse.ok(planner);
    }

    /*
     * 플래너 수정
     */
    @MessageMapping("/planner/{ideaId}")
    public ApiResponse<PlannerResponseDto> updatePlanner(@DestinationVariable Long ideaId, DocumentOperationDto operation) {
        PlannerResponseDto updatedPlanner = plannerService.updateContent(operation);
        /* 변경사항을 모든 구독자에게 브로드캐스트
         * 웹소켓 메시징은 별도의 경로 체계를 가짐 /topic/planner/{ideaId}
         */
        messagingTemplate.convertAndSend("/topic/planner/" + ideaId, updatedPlanner);
        return ApiResponse.ok(updatedPlanner);
    }
}