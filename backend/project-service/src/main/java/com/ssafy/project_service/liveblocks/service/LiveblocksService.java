package com.ssafy.project_service.liveblocks.service;

import com.ssafy.project_service.common.dto.UserDto;
import com.ssafy.project_service.liveblocks.controller.LiveblocksFeignClient;
import com.ssafy.project_service.liveblocks.dto.request.GetUserIdTokenReq;
import com.ssafy.project_service.liveblocks.dto.response.GetUserIdTokenRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class LiveblocksService {

    private final LiveblocksFeignClient liveblocksFeignClient;

    @Transactional(readOnly = true)
    public GetUserIdTokenRes getLiveblocksUserIdToken(UserDto user) {

        GetUserIdTokenReq getUserIdTokenReq = GetUserIdTokenReq.builder()
                .userId(user.getId().toString())
                .userInfo(
                        GetUserIdTokenReq.UserInfo.builder()
                                .name(user.getUsername())
                                .build()
                )
                .build();
        GetUserIdTokenRes getUserIdTokenRes
                = liveblocksFeignClient.getLiveblocksUserIdToken(getUserIdTokenReq);
        GetUserIdTokenRes token = new GetUserIdTokenRes(getUserIdTokenRes.getToken());
        return token;
    }
}
