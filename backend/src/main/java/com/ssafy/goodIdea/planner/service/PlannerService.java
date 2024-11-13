package com.ssafy.goodIdea.planner.service;

import com.ssafy.goodIdea.common.exception.BaseException;
import com.ssafy.goodIdea.common.exception.ErrorType;
import com.ssafy.goodIdea.planner.dto.response.PlannerResponseDto;
import com.ssafy.goodIdea.planner.entity.Planner;
import com.ssafy.goodIdea.planner.repository.PlannerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlannerService {
    private final PlannerRepository plannerRepository;
    private final Map<Long, String> documentCache = new ConcurrentHashMap<>();

    public PlannerResponseDto getPlanner(Long ideaId) {
        Planner planner = plannerRepository.findByIdeaId(ideaId)
                .orElseThrow(() -> new BaseException(ErrorType.PLANNER_NOT_FOUND));
        return PlannerResponseDto.from(planner);
    }

    public void mergePlanner(Long ideaId, String content) {
        documentCache.put(ideaId, content);
    }

    @Transactional
    public void updatePlanner(Long ideaId, String content) {
        Planner planner = plannerRepository.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Planner not found for ideaId: " + ideaId));
        planner.updateContent(content);
        plannerRepository.save(planner);
        log.info("Saved document for ideaId: {}", ideaId);
    }
}
