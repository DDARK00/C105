package com.ssafy.user_service.user.dto.request;

import com.ssafy.user_service.user.entity.LocationType;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChangeUserLocationRequestDto {
    String name;
    LocationType locationType;
    Integer grade;
}
