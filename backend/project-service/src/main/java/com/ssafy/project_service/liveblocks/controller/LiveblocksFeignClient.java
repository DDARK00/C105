package com.ssafy.project_service.liveblocks.controller;

import com.ssafy.project_service.common.config.LiveblocksFeignConfig;
import com.ssafy.project_service.liveblocks.dto.request.CreateRoomReq;
import com.ssafy.project_service.liveblocks.dto.request.GetUserIdTokenReq;
import com.ssafy.project_service.liveblocks.dto.request.UpdateRoomReq;
import com.ssafy.project_service.liveblocks.dto.response.ChangeRoomRes;
import com.ssafy.project_service.liveblocks.dto.response.GetUserIdTokenRes;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(
        name="liveblocksFeignClient",
        url="https://api.liveblocks.io/v2",
        configuration = { LiveblocksFeignConfig.class }
)

public interface LiveblocksFeignClient {

    // user ID token 발급 받기
    @PostMapping(value = "/identify-user", consumes = "application/json")
    GetUserIdTokenRes getLiveblocksUserIdToken(
        @RequestBody GetUserIdTokenReq getUserIdTokenReq
    );

    // create room
    @PostMapping(value = "/rooms", consumes = "application/json")
    ChangeRoomRes createRoom(
        @RequestBody CreateRoomReq createRoomReq
    );

    // update room
    // roomId가 /project/{projectId}/outline 같은 형식인데, 이를 PathVariable로 받으면 %2F -> / 로 자동 인코딩이 돼버린다
    // 그래서 (일단) 이렇게 하드 코딩하는 수밖에..
    @PostMapping(value = "/rooms/%2Fproject%2F{projectId}%2F{stepName}", consumes = "application/json")
    ChangeRoomRes updateRoom(
        @PathVariable("projectId") String projectId,
        @PathVariable("stepName") String stepName,
        @RequestBody UpdateRoomReq updateRoomReq
    );

    @GetMapping(value = "/rooms/essential-room-%2Fproject%2F{projectId}%2Fidea%2F{ideaId}%2F{stepName}/storage?format=json", consumes = "application/json")
    Map<String, Object> getRoomStorageDocument(
            @PathVariable("projectId") String projectId,
            @PathVariable("ideaId") String ideaId,
            @PathVariable("stepName") String stepName
    );

}
