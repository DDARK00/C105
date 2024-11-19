<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=header" width="100%" >

# Newstock

기획이 어려운 SSAFY인을 위한 [SSAFY 프로젝트 기획 보조] 서비스 “**GoodIdea**”

`SSAFY 11th 자율 PJT`

`개발기간: 24.10.14 ~ 24.11.19 (5주)`

![image (21).png](Picture/Logo.png)

# 목차

1. [서비스 소개](#-서비스-소개)
2. [화면 소개](#-화면-소개)
3. [기술 스택](#-기술-스택)
4. [서비스 아키텍처](#-서비스-아키텍처)
5. [프로젝트 산출물](#-프로젝트-산출물)
6. [팀원 구성](#-팀원-구성)

---

# ✨ 서비스 소개

## 기획 배경

- SSAFY 프로젝트 진행 시 기획 단계에서 다음과 같은 어려움을 해결하고자 서비스 개발
- 아이디어 부족: 창의적인 프로젝트 주제 선정의 어려움.
- 효율성 저하: 팀원 간 실시간 협업과 기획 내용 공유의 비효율성.
- 트렌드 반영: 최신 기술 스택과 취업 시장 트렌드 반영 부족.
- 문서 작성 부담: 프로젝트 명세서, ERD 등 산출물 작성의 어려움.

## 기능 소개 🔍

<div align="center">

### 📌 마인드맵 기능

    - 사용자가 입력한 키워드를 기반으로 관련 아이디어와 주제를 마인드맵 형태로 시각화.
    - 최신 뉴스 및 데이터 분석을 통해 창의적인 주제 추천.
    - 팀원과 실시간으로 아이디어 브레인스토밍 가능.

### 📌 AI 기획서 기능

    - 사용자가 입력한 키워드와 프로젝트 방향성을 기반으로 기획서 초안을 자동 생성.
    - 목표, 기술 스택 추천, 요구사항 명세서 등 기획에 필요한 모든 항목 자동 작성.
    - 최신 트렌드 기반으로 기술 스택 추천.

### 📌 CRDT 기능

    - Conflict-Free Replicated Data Type (CRDT) 기반으로 실시간 협업 가능.
    - 여러 사용자가 동시 작업 시 변경 사항 자동 병합.
    - 팀원 간 기획 문서 실시간 작성 및 수정 가능.

### 📌 산출물 관리

    - 기획 산출물 생성 및 관리
    - 기획서
    - 요구사항 명세서
    - API 명세서
    - ERD
    - FLOWCHART
    - 팀 내 공유 및 업데이트를 자동화하여 협업 효율성 향상.

</div>

# 💻 화면 소개

<details>
 <summary>📢 페이지 상세설명</summary>
 <div markdonw="1">

![사1](/uploads/292e5fd3845f997454dc53084eccbace/사1.JPG)
![사2](/uploads/861ba765523edac0f3e92f11a10adb19/사2.JPG)
![사3](/uploads/2d453208068b5b014ab7a5353949518a/사3.JPG)
![사4](/uploads/7f1ac2acd939be1bcb1b6e77a4763367/사4.JPG)
![사5](/uploads/8d162e959cb85243c535475099ac4f28/사5.JPG)
![사6](/uploads/3531e4dd145841a6d03ef2747ecf3861/사6.JPG)
![사7](/uploads/cc6281fd8cabd719237661bec9fff1bb/사7.JPG)
![사8](/uploads/1292f0d17e3a7f130d2cbd9c5071b2d5/사8.JPG)
![사9](/uploads/dbd6820f583a767586242c9aeb7b970a/사9.JPG)
![사10](/uploads/4c35087a19c868d53002d948d1e2225d/사10.JPG)
![사11](/uploads/ec36e7409794b975ee3914a3025cfc2c/사11.JPG)
![사12](/uploads/59e81de9b0f75c22bf9b609fc7e3da1e/사12.JPG)
![사13](/uploads/9af6fa24b1d982e247c844127bde8f61/사13.JPG)
![사14](/uploads/e68bf9faff1946b3576e3e75e20473b2/사14.JPG)
![사15](/uploads/7d60418943d41034fcff8f46f437c45b/사15.JPG)

 </div>
</details>

<details>
 <summary>📢 기능 GIF</summary>
 <div markdonw="1">

![gif1](/uploads/343ba34d823ac46e51c84f5cae80b6bb/gif1.gif)
![gif2](/uploads/987fe1e4a999a15272c7a211ccf48036/gif2.gif)
![gif3](/uploads/02db450a20b1639f2855f8baf4e53593/gif3.gif)
![gif4](/uploads/48e7761f4ee20a4a110263519419b2b1/gif4.gif)
![gif5](/uploads/6de9b8389127fffa7f28eb2c0790bdb6/gif5.gif)
![gif6](/uploads/28aa1388762d814b81c23082127af103/gif6.gif)
![gif7](/uploads/4bfff855bf6c4907afbf354766a3fa64/gif7.gif)
![gif8](/uploads/4267636d9596e6fafe17c20cbc75edf6/gif8.gif)
![gif9](/uploads/d7b18e05817ae9793a821aaca7edc180/gif9.gif)
![gif10](/uploads/449bc42a71138734f221eaee164aee53/gif10.gif)
![gif11](/uploads/f76310c773c593cd93be796caa0675a3/gif11.gif)

### 마인드맵 기능

### AI 기획서 기능

### 실시간 협업

### 산출물 관리

### 아이디어 보드

### AI 챗봇

 </div>
</details>

# 🛠 기술 스택

<div align="center">

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

### Infrastructure

![Jenkins](https://img.shields.io/badge/jenkins-D24939.svg?style=flat&logo=jenkins&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=flat&logo=nginx&logoColor=white)
<img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=flat&logo=Amazon EC2&logoColor=white">
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=Docker&logoColor=white">

### Backend

![Spring](https://img.shields.io/badge/spring-6DB33F.svg?style=flat&logo=spring&logoColor=white)
<img src ="https://img.shields.io/badge/Spring_Security-6DB33F?style=flat&logo=Spring-Security&logoColor=white">
<img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=flat&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/Spring Cloud-6DB33F?style=flat&logo=spring&logoColor=white">
<img src="https://img.shields.io/badge/Gradle-02303A?style=flat&logo=Gradle&logoColor=white">
<img src="https://img.shields.io/badge/Apache Kafka-231F20?style=flat&logo=Apache Kafka&logoColor=white">
<img src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=FastAPI&logoColor=white">
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)

### DB

![Redis](https://img.shields.io/badge/Redis-FF4438.svg?style=flat&logo=redis&logoColor=white)
![MySQL](https://img.shields.io/badge/MariaDB-003545?style=flat&logo=MariaDB&logoColor=white)
<img src="https://img.shields.io/badge/Elasticsearch-005571?style=flat&logo=elasticsearch&logoColor=white">
<img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=MongoDB&logoColor=white">

### TOOL

<img src="https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white">
<img src="https://img.shields.io/badge/GitLab-FC6D26?style=flat&logo=GitLab&logoColor=white">
<img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/Mattermost-0058CC?style=flat&logo=mattermost&logoColor=white">
<img src="https://img.shields.io/badge/Jira-0052CC?style=flat&logo=jira&logoColor=white">
<img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white">
<img src="https://img.shields.io/badge/OpenAI-412991?style=flat&logo=OpenAI&logoColor=white">
<img src="https://img.shields.io/badge/Logstash-005571?style=flat&logo=Logstash&logoColor=white">

### Data

![Python](https://img.shields.io/badge/python-3670A0?style=flat&logo=python&logoColor=ffdd54)
<img src="https://img.shields.io/badge/Pytorch-EE4C2C?style=flat&logo=Pytorch&logoColor=white">
<img src="https://img.shields.io/badge/Kibana-005571?style=flat&logo=Kibana&logoColor=white">

</div>

# 📌 기술 상세 설명

![핵1](/uploads/75dfad332b6197e635807e014e0294cc/핵1.JPG)
![핵2](/uploads/7bb4c7fe2046a471b85a1715896c3d9a/핵2.JPG)
![핵3](/uploads/7ada22ff57dbb91207bc8d2cb18e652f/핵3.JPG)
![핵4](/uploads/a66da607eadbcfec672fec9c76b267e8/핵4.JPG)
![핵5](/uploads/25e19b3d9e926914bf8f8d6665d86e4e/핵5.JPG)
![핵6](/uploads/38e4982f4b66c81f600ce54d7fb959cd/핵6.JPG)
![핵7](/uploads/2640563714d8a5c82bad45301b55fed0/핵7.JPG)
![핵8](/uploads/379b578fe85fdb677ed997fa34ef9c5d/핵8.JPG)
![핵9](/uploads/023bd2b5b262a69fac08bfba3cdae3c9/핵9.JPG)
![핵10](/uploads/4b1d292ddd90800d5b8ae503ad542b18/핵10.JPG)
![핵11](/uploads/7211c13d048e5bed84c0b32eed5715e2/핵11.JPG)
![핵12](/uploads/32b6ee821717ad65a13970b1492d1263/핵12.JPG)
![핵13](/uploads/306c52dac97ccaaf1dc24a8bb7e3c9a8/핵13.JPG)

# 📚 프로젝트 산출물

## 1. Figma([url](https://www.figma.com/design/PlhssolhdTtgMaYcgImZ6B/C105?node-id=0-1&node-type=canvas&t=JCbGzA0Uc2WUfZQ6-0))

![figma](/uploads/57845c1a32e83e0654687a99df379b9d/figma.JPG)

## 2. ERD

![ERD]()

## 3. 요구사항 명세서

![요구](/uploads/926f51ccc506bbd5b19d559f8614b02e/요구.JPG)

## 4. 아키텍처

![아키](/uploads/6922ba7a7334f21899c4ee6a0e8e0b10/아키.JPG)

# 👨‍👨‍👧‍👦 팀원 구성

<table>
  <tbody>
    <tr>
      <td align="center">
        <img src="Picture/juho.JPG" alt="FE 팀장 : 이주호" width="100px"/>
        <br />
        <sub><b>FE 팀장 : 이주호</b></sub>
      </td>
      <td align="center">
        <img src="Picture/jh.jpg" alt="BE 팀원 : 전지훈" width="100px"/>
        <br />
        <sub><b>FE/AI 팀원 : 전지훈</b></sub>
      </td>
      <td align="center">
        <img src="Picture/sh.png" alt="FE 팀원 : 한세훈" width="100px"/>
        <br />
        <sub><b>FE LEADER 팀원 : 한세훈</b></sub>
      </td>
      <td align="center">
        <img src="Picture/ty.png" alt="BE 팀원 : 김태연" width="100px"/>
        <br />
        <sub><b>BE 팀원 : 김태연</b></sub>
      </td>
      <td align="center">
        <img src="Picture/ys.png" alt="INFRA 팀원 : 천요성" width="100px"/>
        <br />
        <sub><b>BE/INFRA 팀원 : 천요성</b></sub>
      </td>
      <td align="center">
        <img src="Picture/us.jpg" alt="BE/AI 팀원 : 황우성" width="100px"/>
        <br />
        <sub><b>BE LEADER/AI 팀원 : 황우성</b></sub>
      </td>
    </tr>
  </tbody>
</table>
<hr/>

✔ 이주호

- 팀장
- UCC 제작
- **[Frontend]** 아이디어 보드 UI 및 API 연결
- **[Frontend]** NAV UI 초안
- **[Frontend]** 프로젝트 생성/수정/조회 API
- **[Frontend]** 아이디어 보드 확대/축소 등 애니메이션
- **[Frontend]** UX 개선(엔드유저 플로우)

✔ 전지훈

- **[Frontend]** 메인 페이지
- **[Frontend]** 산출물 페이지(REQ, API, ERD, FLOW_CHART)
- **[Frontend]** AI 기획서
- **[Frontend]** 기획서 (MD EDITOR)
- **[Frontend]** AI CHAT_BOT
- **[PT]** PPT 제작
- **[PT]** 중간 발표

✔ 한세훈

- **[Frontend]** 마인드맵
- **[Frontend]** CRDT
- **[Frontend]** QA
- **[Backend]** QA
- **[Backend]** 코드 낭독, 설계 보조
- **[ETC]** 코드 최적화(퍼포먼스, 번들링, 네트워크)
- **[ETC]** 그외 잡다한 일

✔ 김태연

-
-
-
-
-
-
-
-

✔ 천요성

- **[Backend]** 프로젝트, 아이디어 관련 추가 서비스 로직 작성 및 오류 테스트 및 수정
- **[Backend]** liveblock storage에 저장된 데이터를 mongoDB에 업데이트 및 조회하는 로직 작성
- **[Backend]** 모놀리식 코드 MSA 구조에 맞게 분리(FeignCleint 등을 활용)
- **[Infra]** 서비스별 독립적인 CI/CD 파이프라인 구축(Gitlab, Jenkins)
- **[Infra]** MSA식 서버 구축(SpringBoot, Spring Cloud, Docker, Docker Composer, Jenkins, EC2)
- **[Infra]** auth-service(redis), user-service, project-service(mariaDB) DB 분리하여 구축
- **[Infra]** NGINX와 Gateway 서버, Eureka 서버를 활용한 트래픽 관리 작업
-

✔ 황우성

- **[Backend]** SpringBoot 스켈레톤 작성 ( Security 구축, 작업 표준 작성[MVC, ResponseAPI, JWT, etc...] )
- **[Backend]** SSAFY Gitlab OAuth 2.0 기반 회원 가입 서비스 구축
- **[Backend]** KcElectra 언어 모델 기반 뉴스 데이터 머신 러닝 및 학습&크롤링 자동화(매일 0시)
- **[Backend]** GPT 프롬프트 기반 AI 기획서 생성 서비스 작성
- **[Backend]** 실시간 뉴스 검색 기능 및 사용자 검색어 기반 Github 레포지토리 조회 서비스 작성
- **[Backend]** 멤버 및 프로젝트 서비스 로직 작성(유저 역할 자동 구분[교육생/코치], GitLab 유저 토큰 관리(Redis) 및 정보 조회 )
- **[Infra]** 모놀리식 CI/CD Test 서버 구축 ( Docker, Jenkins, MariaDB, Redis )
- **[Infra]** 뉴스 기사 기반 단어 추천 서비스 인프라 구축 ( FASTAPI, DOCKER, JENKINS )
- **[Infra]** 머신러닝 서버 기능별 분리(추천, 크롤링, 학습) 및 크롤링 파이프라인 구축( Kafka, ElasticSearch, LogStash, Kibana )

<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=footer" width="100%" >
