package com.ssafy.project_service.liveblocks.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.project_service.liveblocks.controller.LiveblocksFeignClient;
import com.ssafy.project_service.liveblocks.dto.request.CreateRoomReq;
import com.ssafy.project_service.liveblocks.dto.request.UpdateRoomReq;
import com.ssafy.project_service.liveblocks.dto.response.ChangeRoomRes;
import com.ssafy.project_service.liveblocks.entity.StepName;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * service + repository의 로직이 함께 있단 점을 고려해 service/repository가 아닌 componenet로 등록
 */

@Log4j2
@Component
@RequiredArgsConstructor
public class LiveblocksComponent {

    private final LiveblocksFeignClient liveblocksFeignClient;
    private final ObjectMapper objectMapper;

    public void createAllStepRooms(String memberId, String ideaId) {
        String roomIdBase = "/idea/" + ideaId + "/"; // roomId: /idea/{ideaId}/

        for (StepName stepName : StepName.values()) {
            CreateRoomReq createRoomReq = CreateRoomReq.builder()
                    .id(roomIdBase + stepName.getRoomName()) // roomId: /idea/{ideaId}/outline
                    .build();
            createRoomReq.usersAccesses().put(memberId, List.of("room:write"));

            ChangeRoomRes changeRoomRes = liveblocksFeignClient.createRoom(createRoomReq);

            // TODO: 성공 실패 처리하면 될 듯
        }
    }

    public void addMemberToAllStepRooms(String memberId, String ideaId) {
        for (StepName stepName : StepName.values()) {
            UpdateRoomReq updateRoomReq = UpdateRoomReq.builder().build();
            updateRoomReq.usersAccesses().put(memberId, List.of("room:write"));

            ChangeRoomRes changeRoomRes = liveblocksFeignClient.updateRoom(
                    ideaId, stepName.getRoomName(), updateRoomReq
            );

            // TODO: 성공 실패 처리하면 될 듯
        }
    }

    public <T> T getRoomStorageDocument(String projectId, String ideaId, StepName stepName, Class<T> clazz) {
        Map<String, Object> map = liveblocksFeignClient.getRoomStorageDocument(projectId, ideaId, stepName.getRoomName());
        Object object = map.get(stepName.getJsonName());
        return objectMapper.convertValue(object, clazz);
    }

    public <T> List<T> getRoomStorageDocuments(String projectId, String ideaId, StepName stepName, Class<T> clazz) {
        Map<String, Object> map = liveblocksFeignClient.getRoomStorageDocument(projectId, ideaId, stepName.getRoomName());
        // "requirements" 계층 확인 및 "data" 추출
        if (map.containsKey("data") && map.get("data") instanceof Map) {
            Map<?, ?> dataMap = (Map<?, ?>) map.get("data");
            if (dataMap.containsKey(stepName.getJsonName()) && dataMap.get(stepName.getJsonName()) instanceof Map) {
                Map<?, ?> requirementsMap = (Map<?, ?>) dataMap.get(stepName.getJsonName());
                if (requirementsMap.containsKey("data") && requirementsMap.get("data") instanceof List<?>) {
                    return ((List<?>) requirementsMap.get("data")).stream()
                            .map(item -> objectMapper.convertValue(item, clazz))
                            .toList();
                }
            }
        }
        return List.of();
    }
}
