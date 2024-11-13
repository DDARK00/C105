// package com.ssafy.goodIdea.liveblocks.service;

// import com.ssafy.goodIdea.liveblocks.config.LiveblocksTokenProvider;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// @Service
// @RequiredArgsConstructor
// public class LiveblocksService {

//     private final LiveblocksTokenProvider tokenProvider;

//     public String createToken(Long ideaId, String documentType) {
//         String roomId = ideaId + "-" + documentType;  // roomId는 아이디어 ID와 문서 유형을 결합하여 생성
//         return tokenProvider.generateToken(ideaId, roomId);
//     }
// }
