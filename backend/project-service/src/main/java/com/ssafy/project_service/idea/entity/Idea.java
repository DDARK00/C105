package com.ssafy.project_service.idea.entity;


import com.ssafy.project_service.common.entity.BaseTime;
import com.ssafy.project_service.idea.dto.request.IdeaUpdateRequestDto;
import com.ssafy.project_service.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Idea extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idea_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id" , nullable = false)
    private Project project;

    @Column(nullable = true)
    private String serviceName; // 서비스명

    @Column(length = 1000, nullable = true)
    private String background; // 기획 배경

    @Column(length = 1000, nullable = true)
    private String introduction; // 서비스 소개

    @Column(length = 1000, nullable = true)
    private String target; // 서비스 타겟

    @Column(length = 1000, nullable = true)
    private String expectedEffect; // 기대효과

    @Column(length = 1000, nullable = true)
    private String projectTopic; // ㅁㄴㅇㄹ

    @Column(length = 1000, nullable = true)
    private String techStack; // ㅇㄴㅀㄴㅇㅀ

    @Column(length = 1000, nullable = true)
    private String advancedStack; // ㅇㄴㅀㅇㅀ

    @Column(nullable = false)
    private float averageRating = 0.0f; // 평균 평점

    @Column(nullable = false)
    private String x;

    @Column(nullable = false)
    private String y;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private String darkColor;

    @Column(nullable = false)
    private String animation;

    @Builder
    public Idea(Project project, String serviceName, String background, String introduction, String target, String expectedEffect, float averageRating, String x, String y, String color, String darkColor, String animation, String projectTopic, String techStack, String advancedStack) {
        this.project = project;
        this.serviceName = serviceName;
        this.background = background;
        this.introduction = introduction;
        this.target = target;
        this.expectedEffect = expectedEffect;
        this.advancedStack = advancedStack;
        this.techStack = techStack;
        this.projectTopic = projectTopic;
        this.averageRating = 0.0f;
        this.x = x;
        this.y = y;
        this.color = color;
        this.darkColor = darkColor;
        this.animation = animation;

    }

    /*
     * 아이디어 평균 평점 업데이트
     */
    public void updateAverageRating(float avgRating) {
        this.averageRating = avgRating;
    }

    /*
     * 아이디어 수정
     */
    public void updateIdea(IdeaUpdateRequestDto dto) {
        this.serviceName = dto.getServiceName();
        this.background = dto.getBackground();
        this.introduction = dto.getIntroduction();
        this.target = dto.getTarget();
        this.expectedEffect = dto.getExpectedEffect();
        this.x = dto.getX();
        this.y = dto.getY();
        this.color = dto.getColor();
        this.darkColor = dto.getDarkColor();
        this.animation = dto.getAnimation();
    }
}
