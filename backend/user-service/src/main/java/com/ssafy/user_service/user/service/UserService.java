package com.ssafy.user_service.user.service;


import com.ssafy.user_service.user.dto.UserDto;
import com.ssafy.user_service.user.dto.request.ChangeUserLocationRequestDto;
import com.ssafy.user_service.user.entity.OAuthProvider;
import com.ssafy.user_service.user.entity.RoleType;
import com.ssafy.user_service.user.entity.User;
import com.ssafy.user_service.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public UserDto changeUserLocation(User user, ChangeUserLocationRequestDto dto) {
        if ( dto.getName() != null )
            user.setName(dto.getName());
        if ( dto.getGrade() != null )
            user.setGrade(dto.getGrade());
        if ( dto.getLocationType() != null)
            user.setLocationType(dto.getLocationType());
        userRepository.save(user);

        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .grade(user.getGrade())
                .locationType(user.getLocationType())
                .roleType(user.getRoleType())
                .build();
    }
    @Transactional
    public User findUserByUsername1(String username) {

        return userRepository.findByUsername(username).orElseThrow();
    }

    @Transactional
    public Optional<UserDto> findUserByUserId(Long userId) {

        return userRepository.findById(userId)
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .username(user.getUsername())
                        .grade(user.getGrade())
                        .locationType(user.getLocationType())
                        .roleType(user.getRoleType())
                        .build()
                );
    }

    public Optional<UserDto> findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .username(user.getUsername())
                        .grade(user.getGrade())
                        .locationType(user.getLocationType())
                        .roleType(user.getRoleType())
                        .build()
                );
    }


    @Transactional
    public UserDto joinUser(String username, RoleType roleType, OAuthProvider oauthProvider) {
        User user = User.builder()
                .username(username)
                .roleType(roleType)
                .oAuthProvider(oauthProvider)
                .build();
        userRepository.save(user);


        return UserDto.builder()
                .username(username)
                .roleType(roleType)
                .build();
    }

    @Transactional
    public List<UserDto> findAllConsultantUsers() {
        return userRepository.findAllByRoleType(RoleType.CONSULTANT)
                .stream()
                .map(user -> new UserDto(user.getId(), user.getName(), user.getUsername(), user.getRoleType(), user.getLocationType(), user.getGrade()))
                .collect(Collectors.toList());
    }

}


