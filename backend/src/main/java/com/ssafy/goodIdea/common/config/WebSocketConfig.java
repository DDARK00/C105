package com.ssafy.goodIdea.common.config;

import com.ssafy.goodIdea.common.handler.DocumentCollaborationHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {
    private final DocumentCollaborationHandler documentCollaborationHandler;

    @Override
    public void registerWebSocketHandlers(@NonNull WebSocketHandlerRegistry registry) {
        registry.addHandler(documentCollaborationHandler, "/api/v1/{documentType}/{ideaId}")
                .setAllowedOrigins("*");
    }
}
