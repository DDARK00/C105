package com.ssafy.user_service.user.controller;


import com.ssafy.user_service.common.exception.ApiResponse;
import com.ssafy.user_service.jwt.JwtTokenProvider;
import com.ssafy.user_service.user.dto.UserDto;
import com.ssafy.user_service.user.dto.request.ChangeUserLocationRequestDto;
import com.ssafy.user_service.user.dto.response.ResponseUser;
import com.ssafy.user_service.user.entity.User;
import com.ssafy.user_service.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    /*
    * 유저 정보 조회
    * */
    @GetMapping("/profile")
    public ApiResponse<UserDto> getUserProfile(@RequestHeader("Authorization") String authorizationHeader) {
        System.out.println("UserController: Authorization header received: " + authorizationHeader);
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenProvider.extractSubject(token);
        User user = userService.findUserByUsername1(username);
        return ApiResponse.ok(UserDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .username(user.getUsername())
                    .roleType(user.getRoleType())
                    .grade(user.getGrade())
                    .locationType(user.getLocationType())
                .build());
    }

    /*
    * 유저 기수, 지역 변경
    * */
    @PutMapping("/update")
    public ApiResponse<UserDto> changeUserLocation(@RequestHeader("Authorization") String authorizationHeader,
                                                   @RequestBody ChangeUserLocationRequestDto dto) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenProvider.extractSubject(token);
        User user = userService.findUserByUsername1(username);
        return ApiResponse.ok(userService.changeUserLocation(user, dto));
    }

    /*
     * 유저네임으로 유저 검색
     * */
    @GetMapping("/getUser/{username}")
    public Optional<UserDto> getUser(@PathVariable("username") String username) {
        return userService.findUserByUsername(username);
    }

    /**
     * 유저Id로 유저 검색
     * */
    @GetMapping("/getUser/Id/{userId}")
    public Optional<UserDto> getUserById(@PathVariable("userId") Long userId) {
        System.out.println("UserController: Received request for user with ID " + userId);
        return userService.findUserByUserId(userId);
    }

    /**
     * RoleType이 컨설턴트인 유저 리스트 조회
     * */
    @GetMapping("/getUser/Consultants")
    public List<UserDto> getAllConsultants() {
        return userService.findAllConsultantUsers();
    }


    @PostMapping(value = "/join", produces = "application/json")
    public Optional<UserDto> joinMember(@RequestBody ResponseUser response) {

        return Optional.of(userService.joinUser(
                response.getUsername(),
                response.getRoleType(),
                response.getOAuthProvider()));
    }

    @PostMapping("/welcome")
    public String welcome() {
        return "You Are Welcome";
    }

}
