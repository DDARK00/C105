package com.ssafy.project_service.liveblocks.controller;

import com.ssafy.project_service.client.UserServiceClient;
import com.ssafy.project_service.common.dto.UserDto;
import com.ssafy.project_service.common.exception.ApiResponse;
import com.ssafy.project_service.jwt.JwtTokenProvider;
import com.ssafy.project_service.liveblocks.dto.response.GetUserIdTokenRes;
import com.ssafy.project_service.liveblocks.service.LiveblocksService;
import com.ssafy.project_service.mindMap.service.MindMapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/liveblocks")
public class LiveblocksController {

    private final LiveblocksService liveblocksService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserServiceClient userServiceClient;

    @GetMapping("")
    public ApiResponse<GetUserIdTokenRes> getLiveblocksUserIdToken(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        System.out.println("liveblocks");
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenProvider.extractSubject(token);
        UserDto user = userServiceClient.getUser(username).orElseThrow();
        return ApiResponse.ok(liveblocksService.getLiveblocksUserIdToken(user));
    }

}
