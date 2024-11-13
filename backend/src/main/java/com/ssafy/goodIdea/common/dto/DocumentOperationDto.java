package com.ssafy.goodIdea.common.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DocumentOperationDto {
    private Long documentId;
    private Long userId;
    private Long ideaId;
    private DocumentType documentType;
    private String operation;
    private String data;
    private String version;
    private String timestamp;

    public enum DocumentType {
        PLANNER,
        // REQ_DOCS,
        // API_DOCS,
        // ERD,
        // FLOWCHART
    }

    public void setIdeaId(Long ideaId) {
        this.ideaId = ideaId;
    }

    public Long getIdeaId() {
        return ideaId;
    }

    public void setData(String jsonData) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setData'");
    }
}
