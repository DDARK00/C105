package com.ssafy.user_service.user.entity;

import com.ssafy.user_service.common.entity.BaseTime;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor
public class User extends BaseTime {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Setter
    @Column(nullable = true)
    private String name;

    @Setter
    @Column(nullable = false, unique = true)
    private String username;

    @Enumerated(value = EnumType.STRING)
    // USER, 컨설턴트
    private RoleType roleType;

    // 지역
    @Enumerated(value = EnumType.STRING)
    @Setter
    private LocationType locationType;

    // 기수
    @Setter
    private Integer grade;

    @Builder
    private User(Long id, String username, RoleType roleType, LocationType locationType, OAuthProvider oAuthProvider) {
        this.id = id;
        this.username = username;
        this.roleType = roleType;
        this.locationType = locationType;
    }

}