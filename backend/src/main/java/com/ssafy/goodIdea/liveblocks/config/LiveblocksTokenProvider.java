// package com.ssafy.goodIdea.liveblocks.config;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.ssafy.goodIdea.common.exception.BaseException;
// import com.ssafy.goodIdea.common.exception.ErrorType;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Component;

// import java.io.OutputStream;
// import java.net.HttpURLConnection;
// import java.net.URL;
// import java.util.HashMap;
// import java.util.Map;

// @Component
// public class LiveblocksTokenProvider {

//     @Value("${liveblocks.secret-key}")
//     private String secretKey;

//     private static final String LIVEBLOCKS_AUTH_URL = "https://api.liveblocks.io/v2/auth";

//     public String generateToken(Long ideaId, String roomId) {
//         try {
//             URL url = new URL(LIVEBLOCKS_AUTH_URL);
//             HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//             connection.setRequestMethod("POST");
//             connection.setRequestProperty("Authorization", "Bearer " + secretKey);
//             connection.setRequestProperty("Content-Type", "application/json");
//             connection.setDoOutput(true);

//             // JSON으로 요청 바디 생성
//             Map<String, Object> payload = new HashMap<>();
//             payload.put("room", roomId);
//             payload.put("user", ideaId.toString());  // 아이디어 ID를 user 필드에 넣어 전송

//             ObjectMapper mapper = new ObjectMapper();
//             String requestBody = mapper.writeValueAsString(payload);

//             // 요청 바디 전송
//             try (OutputStream os = connection.getOutputStream()) {
//                 byte[] input = requestBody.getBytes("utf-8");
//                 os.write(input, 0, input.length);
//             }

//             // 응답 파싱
//             if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
//                 Map<String, Object> response = mapper.readValue(connection.getInputStream(), Map.class);
//                 return (String) response.get("token");
//             } else {
//                 throw new BaseException(ErrorType.INVALID_TOKEN, "Liveblocks 토큰 생성 실패: " + connection.getResponseMessage());
//             }
//         } catch (Exception e) {
//             throw new BaseException(ErrorType.INVALID_TOKEN, "Liveblocks token 생성 오류", e);
//         }
//     }
// }
