from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from pathlib import Path
from typing import Any, Dict, List
from recommend import save_token
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

# ELASTIC ID, PW 설정
ELASTIC_ID = os.getenv("ELASTIC_ID")
ELASTIC_PW = os.getenv("ELASTIC_PW")

# Elasticsearch 인스턴스
es = Elasticsearch("http://elasticsearch:9200", basic_auth=(ELASTIC_ID, ELASTIC_PW))

@app.post("/api/v1/training/all")
def trainingALL():
    page_size = 1000
    page = 10
    
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
        print("datetime: ", hits[-1]["_source"]["date"], " / page : ", page )
        if not hits:
            break
        
        for hit in hits:
            tokens = hit["_source"]["tokens"]
            for token in tokens:
                save_token(token, es)
        
        page += 1

@app.post("/api/v1/training")
async def training():
    page_size = 1000
    page = 0
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y%m%d")
    # start_date = "20241112"
    # end_date = "20241117"

    while True:
        try:
            data = es.search(
                index="news-topic",
                    body={
                        "query": {
                            "range": {
                                "date": {
                                    "gte": yesterday,
                                    "lte": yesterday,
                                    "format": "yyyyMMdd"
                                }
                            }
                        }
                    },
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