package com.ssafy.project_service.common.dto;



import com.ssafy.project_service.common.entity.LocationType;
import com.ssafy.project_service.common.entity.RoleType;
import lombok.Builder;
import lombok.Getter;


@Getter
public class UserDto {
    private Long id;
    private String username;
    private RoleType roleType;
    private LocationType locationType;
    private Integer grade;


    @Builder
    public UserDto(Long id, String username, RoleType roleType, LocationType locationType, Integer grade) {
        this.id = id;
        this.username = username;
        this.grade = grade;
        this.locationType = locationType;
        this.roleType = roleType;

    }

}
