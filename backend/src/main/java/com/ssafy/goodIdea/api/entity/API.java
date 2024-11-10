package com.ssafy.goodIdea.api.entity;

import com.ssafy.goodIdea.apiDocs.entity.APIDocs;
import com.ssafy.goodIdea.common.entity.BaseTime;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class API extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "api_id")
    private Long apiId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apidocs_id", nullable = false)
    private APIDocs apiDocs;

    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false)
    private MethodType methodType; // 메소드

    @Column(nullable = false)
    private String url; // URL

    @Column(nullable = false)
    private String domain; // 도메인

    @Column(length = 500)
    private String description; // 설명

    @Builder
    public API(APIDocs apiDocs, MethodType methodType, String url, String domain, String description) {
        this.apiDocs = apiDocs;
        this.methodType = methodType;
        this.url = url;
        this.domain = domain;
        this.description = description;
    }
}
