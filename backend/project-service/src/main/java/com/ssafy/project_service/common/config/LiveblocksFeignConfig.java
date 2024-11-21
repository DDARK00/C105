package com.ssafy.project_service.common.config;

import feign.RequestInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

@Slf4j
public class LiveblocksFeignConfig {

    @Value("${liveblocks_secret_key}")
    String secretKey;

    @Bean
    public RequestInterceptor liveblocksHeaderInterceptor() {
        return template -> {
            template.header("Authorization", "Bearer " + secretKey);
        };
    }

}
