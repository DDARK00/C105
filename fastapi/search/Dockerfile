# Python 3.8 기반 이미지
FROM python:3.8

# 필요한 패키지 설치 (librdkafka 및 Java 17)
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

# JAVA_HOME 환경 변수 설정
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# ubuntu 사용자 생성
RUN useradd -s /bin/bash -m ubuntu

# 작업 디렉터리 설정 및 파일 복사
WORKDIR /search
COPY . /search
COPY requirements-search.txt .

# ubuntu 사용자로 pip3 설치
RUN chown -R ubuntu:ubuntu /search
USER ubuntu
RUN pip3 install --user -r requirements-search.txt

# 포트 노출
EXPOSE 8080
EXPOSE 11000

# FastAPI 서버 실행 명령어에 python -m uvicorn 사용
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
