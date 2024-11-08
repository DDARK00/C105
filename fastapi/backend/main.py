from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from github import Github, GithubException
import asyncio
from confluent_kafka import Producer, KafkaError
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os
import httpx
from pathlib import Path
import requests
import json
from utils import crawl_daum_news, handle_crawl_news_all_request
from typing import Any, Dict, List
from recommend import hybrid_search, generate_embedding, save_token
from elasticsearch import Elasticsearch

app = FastAPI()
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# .env 불러오기
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)
GITHUB_ACCESS_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")

# Naver API 접근 설정
NAVER_API_ID = os.getenv("NAVER_API_ID")
NAVER_API_SECRET = os.getenv("NAVER_API_SECRET")

# ELASTIC ID, PW 설정
ELASTIC_ID = os.getenv("ELASTIC_ID")
ELASTIC_PW = os.getenv("ELASTIC_PW")

# Elasticsearch 인스턴스
es = Elasticsearch("http://elasticsearch:9200", basic_auth=(ELASTIC_ID, ELASTIC_PW))

# @app.post("/api/v1/recommend")
# async def read_root():
#     temp_list = list()
#     keywords = ["미국", "중국", "인도", "다우기술", "베트남", 
#                 "북한", "멕시코", "아르헨티나", "메시", "페이커"]
#     for keyword in keywords:
#         temp_list.append(keyword)

#     return {"data": temp_list}

@app.get("/api/v1/search")
async def search(keyword: str = Query(..., description="검색에 사용할 단일 키워드 입력")):
    # 'ssafy'와 '싸피' 각각을 포함하는 두 개의 쿼리 생성
    query_ssafy = f"{keyword} ssafy in:name,description NOT 알고리즘 NOT 스터디 NOT study NOT 특강"
    query_싸피 = f"{keyword} 싸피 in:name,description NOT 알고리즘 NOT 스터디 NOT study"

    try:
        g = Github(GITHUB_ACCESS_TOKEN)

        # 두 쿼리를 각각 검색하여 결과를 병합
        repos_ssafy = g.search_repositories(query=query_ssafy)
        repos_싸피 = g.search_repositories(query=query_싸피)

        results = []
        tasks = []

        async with httpx.AsyncClient() as client:
            # 첫 번째 쿼리 결과 처리
            if repos_ssafy.totalCount > 0:
                for repo in repos_ssafy:  # 최대 15개의 결과만 처리
                    tasks.append(fetch_repo_info(client, repo))

            # 두 번째 쿼리 결과 처리
            if repos_싸피.totalCount > 0:
                for repo in repos_싸피:  # 최대 15개의 결과만 처리
                    tasks.append(fetch_repo_info(client, repo))

            results = await asyncio.gather(*tasks)

        total_count = len(results)  # 최종 병합된 결과 수 계산

        return {"total_count": total_count, "repositories": results}

    except GithubException as e:
        return {"error": f"Failed to fetch data from GitHub: {e}"}

async def fetch_repo_info(client, repo):
    return {
        'name': repo.name,
        'full_name': repo.full_name,
        'html_url': repo.html_url,
        'description': repo.description,
        'language': repo.language,
        'stargazers_count': repo.stargazers_count,
        'forks_count': repo.forks_count,
    }

@app.get("/api/v1/news")
async def get_news(query: str = Query(..., description="검색할 키워드를 입력하세요")) -> Any:
    url = f"https://openapi.naver.com/v1/search/news.json?query={query}&sort=sim&display=40"
    headers = {
        "X-Naver-Client-Id": NAVER_API_ID,
        "X-Naver-Client-Secret": NAVER_API_SECRET
    }
    # Naver API에 요청
    response = requests.get(url, headers=headers)
    
    # 요청이 성공적이지 않은 경우 예외 처리
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Naver API 요청 실패")

    # JSON 형태로 결과 반환
    return response.json()

@app.post("/api/v1/crawling/news")
async def start_news_crawling():
    try:
        crawl_daum_news((datetime.now() - timedelta(days=1)).strftime("%Y%m%d"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/v1/crawling/news/all")
async def all_news_crawling():
    try:
        handle_crawl_news_all_request()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/v1/training")
async def training():
    page_size = 1000
    page = 0
    
    while True:
        try:
            data = es.search(
                index="news-topic",
                body={"query": {"match_all": {}}},
                size=page_size,
                from_=page * page_size
            )
        except Exception as e:
            break
        
        hits = data["hits"]["hits"]
        if not hits:
            break
        
        for hit in hits:
            tokens = hit["_source"]["tokens"]
            for token in tokens:
                save_token(token, es)
        
        page += 1

@app.get("/api/v1/recommend")
async def recommend(keyword: str = Query(..., description="검색어")):
    recommended_tokens = hybrid_search(keyword, es)
    
    return {"data": recommended_tokens}