package com.ssafy.goodIdea.common.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.goodIdea.api.service.APIService;
import com.ssafy.goodIdea.apiDocs.service.APIDocsService;
import com.ssafy.goodIdea.common.dto.DocumentOperationDto;
import com.ssafy.goodIdea.planner.service.PlannerService;
import com.ssafy.goodIdea.req.service.ReqService;
import com.ssafy.goodIdea.reqDocs.service.ReqDocsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class DocumentCollaborationHandler extends TextWebSocketHandler {
    private final PlannerService plannerService;
    private final ReqService reqService;
    private final ReqDocsService reqDocsService;
    private final APIService apiService;
    private final APIDocsService apiDocsService;
    
    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) {
        String roomId = getRoomId(session);
        rooms.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
        log.info("New WebSocket connection established: {}", session.getId());
    }

    @Override
    public void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws IOException {
        try {
            DocumentOperationDto operation = objectMapper.readValue(message.getPayload(), DocumentOperationDto.class);
            
            // 각 도메인별 처리
            switch (operation.getDocumentType()) {
                case PLANNER:
                    plannerService.updateContent(operation);
                    break;
                // case REQUIREMENT:
                //     reqService.updateContent(operation);
                //     break;
                // case REQ_DOCS:
                //     reqDocsService.updateContent(operation);
                //     break;
                // case API:
                //     apiService.updateContent(operation);
                //     break;
                // case API_DOCS:
                //     apiDocsService.updateContent(operation);
                //     break;
            }
            
            // 같은 방의 다른 클라이언트들에게 브로드캐스트
            broadcastToRoom(getRoomId(operation), message);
            
        } catch (Exception e) {
            log.error("Error handling WebSocket message", e);
            session.sendMessage(new TextMessage("Error processing message: " + e.getMessage()));
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
        String roomId = getRoomId(session);
        rooms.getOrDefault(roomId, Collections.emptySet()).remove(session);
        log.info("WebSocket connection closed: {}", session.getId());
    }

    private void broadcastToRoom(String roomId, TextMessage message) {
        rooms.getOrDefault(roomId, Collections.emptySet()).forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(message);
                }
            } catch (IOException e) {
                log.error("Failed to send message to session: {}", session.getId(), e);
            }
        });
    }

    private String getRoomId(@NonNull WebSocketSession session) {
        var uri = session.getUri();
        if (uri == null) {
            throw new IllegalStateException("WebSocket URI cannot be null");
        }
        String path = uri.getPath();
        String[] pathParts = path.split("/");
        // /api/v1/{documentType}/{ideaId} 형식에서 documentType과 ideaId 추출
        String documentType = pathParts[pathParts.length - 2];
        String ideaId = pathParts[pathParts.length - 1];
        return documentType + "_" + ideaId;
    }

    private String getRoomId(DocumentOperationDto operation) {
        return operation.getDocumentType().toString().toLowerCase() + "_" + operation.getIdeaId();
    }

    @Override
    public void handleTransportError(@NonNull WebSocketSession session, @NonNull Throwable exception) {
        log.error("Transport error occurred for session: {}", session.getId(), exception);
    }
}
