package com.ssafy.goodIdea.planner.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.goodIdea.common.dto.DocumentOperationDto;
import com.ssafy.goodIdea.common.exception.BaseException;
import com.ssafy.goodIdea.common.exception.ErrorType;
import com.ssafy.goodIdea.planner.dto.response.PlannerResponseDto;
import com.ssafy.goodIdea.planner.entity.Planner;
import com.ssafy.goodIdea.planner.repository.PlannerRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Optional;
import com.fasterxml.jackson.core.JsonProcessingException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlannerService {
    private final PlannerRepository plannerRepository;
    private final ObjectMapper objectMapper;

    public PlannerResponseDto getPlanner(Long ideaId) {
        Planner planner = plannerRepository.findByIdeaId(ideaId)
            .orElseThrow(() -> new BaseException(ErrorType.PLANNER_NOT_FOUND));
        
        return PlannerResponseDto.from(planner);
    }

    @Transactional
    public PlannerResponseDto updateContent(DocumentOperationDto operationDto) {
        Planner planner = plannerRepository.findByIdeaId(Long.parseLong(operationDto.getIdeaId()))
                .orElseThrow(() -> new BaseException(ErrorType.PLANNER_NOT_FOUND));
        
        // CRDT 작업 처리
        JsonNode currentContent = Optional.ofNullable(planner.getContent())
                .map(content -> {
                    try {
                        return objectMapper.readTree(content);
                    } catch (Exception e) {
                        throw new BaseException(ErrorType.SERVER_ERROR);
                    }
                })
                .orElseThrow(() -> new BaseException(ErrorType.SERVER_ERROR));

        JsonNode newOperation = Optional.ofNullable(operationDto.getData())
                .map(data -> {
                    try {
                        return objectMapper.readTree(data);
                    } catch (Exception e) {
                        throw new BaseException(ErrorType.SERVER_ERROR); 
                    }
                })
                .orElseThrow(() -> new BaseException(ErrorType.SERVER_ERROR));
        
        // CRDT 병합 로직 적용
        JsonNode mergedContent = mergeCRDT(currentContent, newOperation);
        
        try {
            planner.updateContent(objectMapper.writeValueAsString(mergedContent));
            return PlannerResponseDto.from(planner);
        } catch (JsonProcessingException e) {
            throw new BaseException(ErrorType.SERVER_ERROR);
        }
    }

    private JsonNode mergeCRDT(JsonNode current, JsonNode operation) {
        // 타임스탬프 기반 CRDT 병합
        if (operation.has("timestamp") && current.has("timestamp")) {
            if (operation.get("timestamp").asLong() > current.get("timestamp").asLong()) {
                return operation;
            }
        }
        return current;
    }
}
