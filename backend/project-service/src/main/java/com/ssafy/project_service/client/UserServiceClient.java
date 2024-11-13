package com.ssafy.project_service.client;



import com.ssafy.project_service.common.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    /*
     GET 요청으로 사용자 정보 가져오기
     */
    @GetMapping("/api/v1/user/getUser/Id/{userId}")
    Optional<UserDto> getUserById(@PathVariable("userId") Long userId);
    /*
     GET 요청으로 컨설턴트 사용자 목록 가져오기
     */
    @GetMapping("/api/v1/user/getUser/Consultants")
    List<UserDto> getAllConsultants();
}
