//package com.ssafy.goodIdea.hello.service;
//
//import com.ssafy.goodIdea.IntegrationTestSupport;
//import com.ssafy.goodIdea.common.redis.RedisService;
//import com.ssafy.goodIdea.hello.dto.response.HelloResponseDto;
//import com.ssafy.goodIdea.hello.entity.Hello;
//import com.ssafy.goodIdea.hello.repository.HelloRepository;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.context.ActiveProfiles;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
////@ActiveProfiles("test")
//@DisplayName("HelloServiceTest")
//public class HelloServiceTest extends IntegrationTestSupport {
//
//    @Autowired
//    private HelloRepository helloRepository;
//
//    @Autowired
//    private HelloService helloService;
//
//    @Autowired
//    private RedisService redisService;
//
//    @AfterEach
//    void tearDown() {
//        helloRepository.deleteAll();
//    }
//
//    @DisplayName("Hello 단일 조회")
//    @Test
//    public void getHelloTest() {
////        given
//        Hello hello = Hello.builder()
//                .content("Hello1")
//                .build();
//
//        helloRepository.save(hello);
//
////      when
//        HelloResponseDto savedHello = helloService.getHello(hello.getId());
//
////        then
//        assertThat(savedHello)
//                .extracting("hello_id","content")
//                .containsExactly(hello.getId(), hello.getContent());
//    }
//
//    @Test
//    public void redisTest() {
//        // given
//        String key = "helloKey";
//        String value = "Hello from Redis!";
//
//        // when
//        redisService.setValues(key, value);  // Redis에 데이터 저장
//        String result = redisService.getValues(key);  // Redis에서 데이터 조회
//
//        // then
//        assertThat(result).isEqualTo(value);  // 저장한 값이 조회되는지 검증
//    }
//
//}
