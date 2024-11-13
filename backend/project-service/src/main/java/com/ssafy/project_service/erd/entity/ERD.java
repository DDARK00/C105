package com.ssafy.project_service.erd.entity;


import com.ssafy.project_service.idea.entity.Idea;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ERD {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "erd_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idea_id", nullable = false)
    private Idea idea;

    @Column(nullable = true)
    private String code; // ERD 코드

    @Builder
    public ERD(Idea idea, String code) {
        this.idea = idea;
        this.code = code;
    }
}

