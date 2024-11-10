package com.ssafy.goodIdea.common.config;

import java.security.Principal;

/**
 * WebSocket 연결에서 사용자를 식별하기 위한 Principal 구현체
 * 
 * Principal 인터페이스:
 * - Java의 보안 프레임워크에서 사용되는 기본 인터페이스
 * - 현재 접속한 사용자의 신원을 나타냄
 * 
 * StompPrincipal의 역할:
 * 1. WebSocket 연결마다 고유한 사용자 식별자 관리
 * 2. STOMP 메시징에서 누가 메시지를 보냈는지 식별
 * 3. 웹소켓 세션 관리 및 사용자별 메시지 라우팅에 활용
 * 
 * 사용 예시:
 * - 실시간 채팅에서 발신자 구분
 * - 특정 사용자에게만 메시지 전송
 * - 연결된 사용자 목록 관리
 */
public class StompPrincipal implements Principal {
    // 사용자를 구분하는 고유 식별자
    private String name;

    /**
     * @param name 사용자 식별자 (예: 세션ID, 사용자ID, IP주소 등)
     */
    public StompPrincipal(String name) {
        this.name = name;
    }

    /**
     * Principal 인터페이스의 필수 구현 메서드
     * @return 사용자 식별자
     */
    @Override
    public String getName() {
        return name;
    }
} 