package com.ssafy.auth_service.common.dto;

import com.ssafy.auth_service.common.entity.LocationType;
import com.ssafy.auth_service.common.entity.OAuthProvider;
import com.ssafy.auth_service.common.entity.RoleType;
import lombok.Builder;
import lombok.Getter;


@Getter
public class UserDto {
    private Long id;
    private String name;
    private String username;
    private RoleType roleType;
    private LocationType locationType;
    private Integer grade;
    private OAuthProvider oAuthProvider;

    @Builder
    public UserDto(Long id, String name, String username, RoleType roleType, LocationType locationType, Integer grade, OAuthProvider oAuthProvider) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.grade = grade;
        this.locationType = locationType;
        this.roleType = roleType;
        this.oAuthProvider = oAuthProvider;
    }

}
