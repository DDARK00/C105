package com.ssafy.goodIdea.common.handler;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class YjsWebSocketHandler extends TextWebSocketHandler {
    
    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String roomId = extractRoomId(session);
        rooms.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
        
        // 연결 유지를 위한 ping-pong 설정
        session.setTextMessageSizeLimit(64 * 1024);
        session.setBinaryMessageSizeLimit(64 * 1024);
        
        log.info("New WebSocket connection established - Session ID: {}, Room ID: {}, URI: {}", 
            session.getId(), roomId, session.getUri());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String roomId = extractRoomId(session);
        Set<WebSocketSession> roomSessions = rooms.get(roomId);
        
        if (roomSessions != null) {
            log.debug("Broadcasting message in room {}: {}", roomId, message.getPayload());
            for (WebSocketSession client : roomSessions) {
                if (!client.equals(session) && client.isOpen()) {
                    try {
                        client.sendMessage(message);
                    } catch (Exception e) {
                        log.error("Error sending message to client in room {}", roomId, e);
                    }
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String roomId = extractRoomId(session);
        Set<WebSocketSession> roomSessions = rooms.get(roomId);
        if (roomSessions != null) {
            roomSessions.remove(session);
            if (roomSessions.isEmpty()) {
                rooms.remove(roomId);
            }
        }
        
        // 1000(정상 종료) 또는 1001(페이지 이동) 이외의 상태 코드일 때만 로그
        if (status.getCode() != 1000 && status.getCode() != 1001) {
            log.warn("WebSocket connection closed abnormally for room: {}, status: {}", roomId, status);
        } else {
            log.info("WebSocket connection closed for room: {}, status: {}", roomId, status);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("WebSocket transport error - Session ID: {}", session.getId(), exception);
        String roomId = extractRoomId(session);
        log.error("Error in room: {}", roomId);
    }

    @Override
    public boolean supportsPartialMessages() {
        return true;
    }

    @Override
protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
    String roomId = extractRoomId(session);
    Set<WebSocketSession> roomSessions = rooms.get(roomId);

    if (roomSessions != null) {
        for (WebSocketSession client : roomSessions) {
            if (!client.equals(session) && client.isOpen()) {
                try {
                    client.sendMessage(message);
                } catch (Exception e) {  // 예외를 IOException으로 제한
                    log.error("Error sending binary message to client in room {}", roomId, e);
                }
            }
        }
    }
}

    private String extractRoomId(WebSocketSession session) {
        String path = session.getUri().getPath();
        String roomId = path.substring(path.lastIndexOf('/') + 1);
        log.debug("Extracted room ID: {} from path: {}", roomId, path);
        return roomId;
    }
}