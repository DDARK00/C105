package com.ssafy.project_service.liveblocks.entity;

import lombok.Getter;

@Getter
public enum StepName {
    OUTLINE("outline", "outline"),
    PLAN("plan", "plan"),
    FUNC("func", "func"),
    FLOW("flow", "flow"),
    ERD("erd", "erd"),
    API("api", "apiList"),
    REQ("requirementsspecification", "reqList"),
    BUILD("build", "build"),
    README("readme", "readme"),
    ;

    final String roomName;
    final String jsonName;

    StepName(String roomName, String jsonName) {
        this.roomName = roomName;
        this.jsonName = jsonName;
    }
}

