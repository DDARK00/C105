package com.ssafy.auth_service.auth.service.client;

import com.ssafy.auth_service.auth.OAuthInfoResponse;
import com.ssafy.auth_service.common.dto.UserDto;
import com.ssafy.auth_service.common.exception.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    /*
    GET 요청으로 username에 해당하는 사용자 정보 가져오기
     */
    @GetMapping("/api/v1/user/getUser/{username}")
    Optional<UserDto> getUser(@PathVariable("username") String username);

    /*
     POST 요청으로 회원 가입 처리
     */
    @PostMapping(value = "/api/v1/user/join", consumes = "application/json")
    Optional<UserDto> joinMember(@RequestBody UserDto user);
}
