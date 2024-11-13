package com.ssafy.user_service.user.dto.response;

import com.ssafy.user_service.user.entity.LocationType;
import com.ssafy.user_service.user.entity.OAuthProvider;
import com.ssafy.user_service.user.entity.RoleType;
import lombok.Builder;
import lombok.Data;

@Data
public class ResponseUser {
    private Long id;
    private String name;
    private String username;
    private RoleType roleType;
    private LocationType locationType;
    private Integer grade;
    private OAuthProvider oAuthProvider;

    @Builder
    public ResponseUser(Long id, String name, String username, RoleType roleType, LocationType locationType, Integer grade, OAuthProvider oAuthProvider) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.grade = grade;
        this.locationType = locationType;
        this.roleType = roleType;
        this.oAuthProvider = oAuthProvider;
    }
}
