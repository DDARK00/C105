// package com.ssafy.goodIdea.common.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.socket.config.annotation.EnableWebSocket;
// import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
// import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
// import org.springframework.beans.factory.annotation.Autowired;

// import com.ssafy.goodIdea.common.handler.YjsWebSocketHandler;

// @Configuration
// @EnableWebSocket
// public class WebSocketConfig implements WebSocketConfigurer {
    
//     @Autowired
//     private YjsWebSocketHandler yjsWebSocketHandler;

//     @Override
//     public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//         registry.addHandler(yjsWebSocketHandler, "ws/**")
//                 .setAllowedOrigins(
//                     "http://localhost:5173",
//                     "https://oracle1.mypjt.xyz"
//                 );
//     }
// }