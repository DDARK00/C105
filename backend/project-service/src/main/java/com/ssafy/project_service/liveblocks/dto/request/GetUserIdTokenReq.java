package com.ssafy.project_service.liveblocks.dto.request;

import lombok.Builder;

import java.util.List;

@Builder
public record GetUserIdTokenReq(
    String userId,
    UserInfo userInfo
) {

    @Builder
    public record UserInfo(
        String name
    ) {
    }

}
