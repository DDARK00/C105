package com.ssafy.gateway_service.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthVerificationFilter implements GlobalFilter, Ordered {

    private final WebClient webClient;

    public AuthVerificationFilter(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("lb://AUTH-SERVICE").build();  // lb:// 사용
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();
        String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        HttpHeaders headers = exchange.getRequest().getHeaders();
        System.out.println("Incoming Request Headers:");
        headers.forEach((headerName, headerValues) ->
                System.out.println(headerName + ": " + String.join(", ", headerValues))
        );

        if ((path.startsWith("/user-service/api/v1/user/") || path.startsWith("/project-service/api/v1/")) && token != null) {
            System.out.println("AuthVerificationFilter: Sending request to AUTH-SERVICE for verification with token: " + token);

            return webClient.get()
                    .uri("/api/v1/auth/verify")
                    .header(HttpHeaders.AUTHORIZATION, token)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, response -> {
                        System.out.println("AuthVerificationFilter: Error response from AUTH-SERVICE: " + response.statusCode());
                        return Mono.error(new RuntimeException("Unauthorized"));
                    })
                    .bodyToMono(String.class)
                    .flatMap(response -> {
                        System.out.println("AuthVerificationFilter: Verification successful, response: " + response);
                        exchange.getRequest().mutate().header("X-Auth-Verified", "true").build();
                        return chain.filter(exchange);
                    })
                    .onErrorResume(error -> {
                        System.out.println("AuthVerificationFilter: Verification failed with error: " + error.getMessage());
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    });
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
