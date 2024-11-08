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

@Service
@RequiredArgsConstructor
@Transactional
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
        System.out.println("=== Update Content Start ===");
        System.out.println("1. IdeaId: " + operationDto.getIdeaId());
        Planner planner = plannerRepository.findByIdeaId(Long.parseLong(operationDto.getIdeaId()))
                .orElseThrow(() -> new BaseException(ErrorType.PLANNER_NOT_FOUND));
        System.out.println("2. Current Content: " + planner.getContent());
        System.out.println("3. New Data: " + operationDto.getData());

        // 현재 content를 JsonNode로 변환
        JsonNode currentContent = Optional.ofNullable(planner.getContent())
            .map(content -> {
                try {
                    JsonNode node = objectMapper.createObjectNode()
                            .put("content", content)
                            .put("timestamp", 0L);
                    System.out.println("4. Current Content as JsonNode: " + node);
                    return node;
                } catch (Exception e) {
                    throw new BaseException(ErrorType.SERVER_ERROR);
                }
            })
            .orElseGet(() -> {
                JsonNode node = objectMapper.createObjectNode()
                        .put("content", "")
                        .put("timestamp", 0L);
                System.out.println("4. Current Content as JsonNode: " + node);
                return node;
            });
            
        // 새로운 작업을 JsonNode로 변환
        JsonNode newOperation = Optional.ofNullable(operationDto.getData())
                .map(data -> {
                    try {
                        JsonNode node = objectMapper.readTree(data);
                        System.out.println("5. New Operation as JsonNode: " + node);
                        return node;
                    } catch (Exception e) {
                        System.out.println("5. Error parsing new operation: " + e.getMessage());
                        throw new BaseException(ErrorType.SERVER_ERROR); 
                    }
                })
                .orElseThrow(() -> new BaseException(ErrorType.SERVER_ERROR));
        
        // CRDT 병합 로직 적용
        JsonNode mergedContent = mergeCRDT(currentContent, newOperation);
        System.out.println("6. Merged Content: " + mergedContent);
        
        try {
            // content 필드만 추출하여 저장
            String contentOnly = mergedContent.get("content").asText();
            System.out.println("7. Final Content to Save: " + contentOnly);
            planner.updateContent(contentOnly);
            PlannerResponseDto response = PlannerResponseDto.from(planner);
            System.out.println("8. Response DTO Created: " + response);
            return response;
        } catch (Exception e) {
            System.out.println("9. Error in final processing: " + e.getMessage());
            throw new BaseException(ErrorType.SERVER_ERROR);
        }
    }

    private JsonNode mergeCRDT(JsonNode current, JsonNode operation) {
        // 둘 중 하나라도 timestamp가 없으면 최신 작업을 우선시
        if (!operation.has("timestamp")) {
            return current;
        }
        if (!current.has("timestamp")) {
            return operation;
        }
        
        // 타임스탬프 비교
        return operation.get("timestamp").asLong() > current.get("timestamp").asLong() 
            ? operation
            : current;
    }
}