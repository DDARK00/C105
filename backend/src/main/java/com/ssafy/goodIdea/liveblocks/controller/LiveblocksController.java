// package com.ssafy.goodIdea.liveblocks.controller;

// import com.ssafy.goodIdea.liveblocks.service.LiveblocksService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/v1/liveblocks")
// @RequiredArgsConstructor
// public class LiveblocksController {

//     private final LiveblocksService liveblocksService;

//     @PostMapping("/auth")
//     public ResponseEntity<?> authenticateUserForRoom(
//             @RequestParam Long ideaId,
//             @RequestParam String documentType  // 문서 유형 전달 (예: proposal, apispecification 등)
//     ) {
//         String token = liveblocksService.createToken(ideaId, documentType);
//         return ResponseEntity.ok().body(Map.of("token", token));
//     }
// }
