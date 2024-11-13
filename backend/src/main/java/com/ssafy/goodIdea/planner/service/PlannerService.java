package com.ssafy.goodIdea.planner.service;

import com.ssafy.goodIdea.common.exception.BaseException;
import com.ssafy.goodIdea.common.exception.ErrorType;
import com.ssafy.goodIdea.planner.dto.request.PlannerUpdateRequestDto;
import com.ssafy.goodIdea.planner.dto.response.PlannerResponseDto;
import com.ssafy.goodIdea.planner.dto.response.PlannerUpdateResponseDto;
import com.ssafy.goodIdea.planner.entity.Planner;
import com.ssafy.goodIdea.planner.repository.PlannerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlannerService {
    private final PlannerRepository plannerRepository;

    public PlannerResponseDto getPlanner(Long ideaId) {
        Planner planner = plannerRepository.findByIdeaId(ideaId)
                .orElseThrow(() -> new BaseException(ErrorType.PLANNER_NOT_FOUND));
        return PlannerResponseDto.from(planner);
    }

    @Transactional
    public PlannerUpdateResponseDto updatePlanner(Long ideaId, PlannerUpdateRequestDto plannerUpdateRequestDto) {
        Planner planner = plannerRepository.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Planner not found for ideaId: " + ideaId));
        planner.updateContent(plannerUpdateRequestDto.getContent());
        plannerRepository.save(planner);
        log.info("Saved document for ideaId: {}", ideaId);
        return PlannerUpdateResponseDto.from(planner);
    }
}
