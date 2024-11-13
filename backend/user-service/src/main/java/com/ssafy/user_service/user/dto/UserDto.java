package com.ssafy.user_service.user.dto;

import com.ssafy.user_service.user.entity.LocationType;
import com.ssafy.user_service.user.entity.OAuthProvider;
import com.ssafy.user_service.user.entity.RoleType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
public class UserDto {
    private Long id;
    private String name;
    private String username;
    private RoleType roleType;
    private LocationType locationType;
    private Integer grade;

    @Builder
    public UserDto(Long id, String name, String username, RoleType roleType, LocationType locationType, Integer grade) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.grade = grade;
        this.locationType = locationType;
        this.roleType = roleType;
    }

}
