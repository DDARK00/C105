package com.ssafy.goodIdea.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;
import java.util.Map;

import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;

/**
 * WebSocket 설정을 위한 Configuration 클래스
 * WebSocket: 실시간 양방향 통신을 위한 프로토콜
 * STOMP: WebSocket 위에서 동작하는 메시징 프로토콜
 */
@Configuration
@EnableWebSocketMessageBroker  // WebSocket 메시지 브로커 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * 메시지 브로커 설정 메서드
     * @param config 메시지 브로커 설정을 위한 레지스트리
     * 
     * enableSimpleBroker: 메시지 브로커가 구독자에게 메시지를 전달할 prefix 설정
     * - /topic: 일대다 메시징 (브로드캐스트)
     * - /queue: 일대일 메시징
     * 
     * setApplicationDestinationPrefixes: 클라이언트가 서버로 메시지 보낼 때 사용할 prefix
     * - /app: 클라이언트가 이 prefix로 시작하는 주소로 메시지를 보내면 @MessageMapping이 처리
     */
    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    /**
     * STOMP 엔드포인트 등록 메서드
     * @param registry STOMP 엔드포인트 등록을 위한 레지스트리
     * 
     * addEndpoint: WebSocket 연결 엔드포인트 설정
     * - /ws: 웹소켓 연결을 위한 엔드포인트 URL
     * 
     * setAllowedOrigins: CORS 설정
     * - 지정된 출처에서만 WebSocket 연결 허용
     */
    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(
                    "http://localhost:5173",
                    "https://oracle1.mypjt.xyz",
                    "wss://oracle1.mypjt.xyz",
                    "ws://localhost:8080"
                )
                .setHandshakeHandler(new DefaultHandshakeHandler() {
                    /**
                     * WebSocket 연결(Handshake) 과정에서 사용자 식별 정보를 생성하는 메서드
                     * 
                     * @param request 클라이언트의 연결 요청 정보를 담은 객체
                     *                - getRemoteAddress(): 클라이언트의 IP 주소
                     *                - getHeaders(): 요청 헤더
                     *                - getPrincipal(): 현재 인증된 사용자 정보
                     * 
                     * @param wsHandler WebSocket 요청을 처리하는 핸들러
                     *                  - 실제 WebSocket 세션 관리
                     *                  - 메시지 송수신 처리
                     * 
                     * @param attributes WebSocket 세션에서 사용할 수 있는 속성 맵
                     *                   - 세션 동안 데이터를 저장하고 공유할 때 사용
                     *                   - 사용자 정의 속성 추가 가능
                     * 
                     * @return Principal 사용자 식별 정보를 담은 객체
                     *         여기서는 IP 주소를 기반으로 한 StompPrincipal 반환
                     */
                    @Override
                    protected Principal determineUser(
                        ServerHttpRequest request,
                        WebSocketHandler wsHandler,
                        Map<String, Object> attributes
                    ) {
                        String clientId = request.getRemoteAddress().toString();
                        return new StompPrincipal(clientId);
                    }
                });
    }
}