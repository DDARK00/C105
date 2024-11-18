from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from datetime import datetime, timedelta
from typing import Any, Dict, List
from utils import crawl_daum_news, handle_crawl_news_all_request
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

@app.post("/api/v1/crawling/news")
async def start_news_crawling():
    try:
        print((datetime.now() - timedelta(days=1)).strftime("%Y%m%d"))
        crawl_daum_news((datetime.now() - timedelta(days=1)).strftime("%Y%m%d"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/v1/crawling/news/all")
async def all_news_crawling():
    try:
        handle_crawl_news_all_request()
        return {"status": "크롤링 작업이 시작되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))