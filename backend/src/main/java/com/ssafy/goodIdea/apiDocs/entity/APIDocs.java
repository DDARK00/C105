package com.ssafy.goodIdea.apiDocs.entity;
import com.ssafy.goodIdea.common.entity.BaseTime;
import com.ssafy.goodIdea.idea.entity.Idea;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class APIDocs extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "apidocs_id")
    private Long apiDocsId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idea_id", nullable = false)
    private Idea idea;

    @Builder
    public APIDocs(Idea idea) {
        this.idea = idea;
    }
}
