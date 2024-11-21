package io.ssafy.soupapi.global.external.liveblocks.dto.outline;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.project_service.common.dto.UserDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
@ToString
public class Outline {
    @JsonProperty("project_name")
    private String name;
    @JsonProperty("project_description")
    private String description;
    @JsonProperty("project_photo")
    private String photo;
    @JsonProperty("project_startDate")
    private String startDate;
    @JsonProperty("project_endDate")
    private String endDate;
    @JsonProperty("project_team")
    List<UserDto> team;
    @JsonProperty("project_tools")
    List<String> tools;
}
