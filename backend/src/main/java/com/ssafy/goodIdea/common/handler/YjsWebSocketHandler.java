// package com.ssafy.goodIdea.common.handler;

// import com.ssafy.goodIdea.planner.service.PlannerService;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.lang.NonNull;
// import org.springframework.stereotype.Component;
// import org.springframework.web.socket.CloseStatus;
// import org.springframework.web.socket.TextMessage;
// import org.springframework.web.socket.WebSocketSession;
// import org.springframework.web.socket.handler.TextWebSocketHandler;

// import java.util.Map;
// import java.util.Set;
// import java.util.concurrent.ConcurrentHashMap;
// import java.util.concurrent.ScheduledExecutorService;
// import java.util.concurrent.Executors;
// import java.util.concurrent.TimeUnit;

// @Slf4j
// @Component
// @RequiredArgsConstructor
// public class YjsWebSocketHandler extends TextWebSocketHandler {
//     private final PlannerService plannerService;
//     private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();
//     private final Map<String, String> latestDocument = new ConcurrentHashMap<>(); // 최신 문서 내용을 캐시에 저장
//     private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1); // 스케줄러

//     @Override
//     public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//         String roomId = extractRoomId(session);
//         rooms.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
//         log.info("New WebSocket connection established - Session ID: {}, Room ID: {}", session.getId(), roomId);
//     }

//     @Override
//     protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//         String roomId = extractRoomId(session);
//         Set<WebSocketSession> roomSessions = rooms.get(roomId);

//         if (roomSessions != null) {
//             for (WebSocketSession client : roomSessions) {
//                 if (!client.equals(session) && client.isOpen()) {
//                     client.sendMessage(message);
//                 }
//             }
//         }

//         // 최신 문서 내용을 캐시에 업데이트하고, 스케줄러를 이용해 2초 후 DB에 저장
//         latestDocument.put(roomId, message.getPayload());
//         scheduler.schedule(() -> saveDocumentToDatabase(roomId), 2, TimeUnit.SECONDS);
//     }

//     private void saveDocumentToDatabase(String roomId) {
//         String content = latestDocument.get(roomId);
//         if (content != null) {
//             log.info("Saving document to database for room: {}", roomId);
//             Long ideaId = Long.valueOf(roomId.split("-")[1]);
//             plannerService.updatePlanner(ideaId, content);
//         }
//     }

//     @Override
//     public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
//         String roomId = extractRoomId(session);
//         Set<WebSocketSession> roomSessions = rooms.get(roomId);
//         if (roomSessions != null) {
//             roomSessions.remove(session);
//             if (roomSessions.isEmpty()) {
//                 rooms.remove(roomId);
//                 latestDocument.remove(roomId); // 캐시에서도 제거
//             }
//         }
//         log.info("WebSocket connection closed for room: {}", roomId);
//     }

//     private String extractRoomId(WebSocketSession session) {
//         if (session.getUri() == null) {
//             log.warn("Session URI is null for session ID: {}", session.getId());
//             throw new IllegalArgumentException("Session URI is null.");
//         }

//         String path = session.getUri().getPath();
//         return path.substring(path.lastIndexOf('/') + 1);
//     }
// }
