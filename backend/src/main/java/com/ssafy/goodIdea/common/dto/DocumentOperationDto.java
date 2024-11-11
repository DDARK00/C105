package com.ssafy.goodIdea.common.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentOperationDto {
    private String documentId;
    private String userId;
    private String ideaId;
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

    public void setIdeaId(String ideaId) {
        this.ideaId = ideaId;
    }

    public String getIdeaId() {
        return ideaId;
    }

    public void setData(String jsonData) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setData'");
    }
}
