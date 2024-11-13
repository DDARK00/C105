package com.ssafy.gateway_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true); // 서버에서 자바스크립트로 JSON을 처리할 수 있도록 설정
        config.addAllowedOrigin("http://localhost:8000");
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("https://oracle1.mypjt.xyz");
        config.addAllowedOrigin("https://goodidea.world");
        config.addAllowedOrigin("https://lab.ssafy.com");
        config.addAllowedHeader("*");   // 모든 헤더 허용
        config.addAllowedMethod("*");   // 모든 HTTP 메서드 허용 (POST, GET, PUT, DELETE, PATCH 등)

        // 모든 경로에 대해 CORS 설정 적용
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
