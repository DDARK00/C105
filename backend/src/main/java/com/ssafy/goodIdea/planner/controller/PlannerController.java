package com.ssafy.goodIdea.planner.controller;

import com.ssafy.goodIdea.planner.dto.request.PlannerUpdateRequestDto;
import com.ssafy.goodIdea.planner.dto.response.PlannerResponseDto;
import com.ssafy.goodIdea.planner.dto.response.PlannerUpdateResponseDto;
import com.ssafy.goodIdea.planner.service.PlannerService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import com.ssafy.goodIdea.common.exception.ApiResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/planner")
public class PlannerController {
    private final PlannerService plannerService;

    /*
     * 기획서 조회
     */
    @GetMapping("/{ideaId}")
    public ApiResponse<PlannerResponseDto> getPlanner(@PathVariable(name = "ideaId") Long ideaId) {
        // PlannerService를 통해 기획서 조회
        PlannerResponseDto plannerResponseDto = plannerService.getPlanner(ideaId);
        return ApiResponse.ok(plannerResponseDto);
    }

    /*
     * 기획서 수정
     */
    @PutMapping("/{ideaId}")
    public ApiResponse<PlannerUpdateResponseDto> updatePlanner(@PathVariable(name = "ideaId") Long ideaId, @RequestBody PlannerUpdateRequestDto plannerUpdateRequestDto) {
        PlannerUpdateResponseDto plannerUpdateResponseDto = plannerService.updatePlanner(ideaId, plannerUpdateRequestDto);
        return ApiResponse.ok(plannerUpdateResponseDto);
    }
}