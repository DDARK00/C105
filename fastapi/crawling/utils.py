import re
import time
import requests
import json
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from konlpy.tag import Okt
from kafka_producer import send_to_kafka

# 기본 설정
base_url = "https://news.daum.net/breakingnews/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36"
}

# 불용어 로드
def load_stopwords():
    response = requests.get("https://raw.githubusercontent.com/stopwords-iso/stopwords-ko/master/stopwords-ko.txt")
    return set(response.text.splitlines())

okt = Okt()
stopwords = load_stopwords()

def extract_meaningful_tokens(text):
    tokens = [word for word, pos in okt.pos(text) if pos == "Noun" and word not in stopwords and len(word) > 1 and word not in ["포토", "사진", "종합", "오늘", "내일", "내년", "한국", "개최", "글로벌", "공개", "사업", "속보"] ]
    return tokens

def get_last_page(target_date):
    response = requests.get(base_url, params={"page": 10000, "regDate": target_date}, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    last_page_tag = soup.select_one("span.inner_paging em.num_page")
    
    if last_page_tag:
        last_page_number = re.search(r'\d+', last_page_tag.text)
        return int(last_page_number.group()) if last_page_number else 1
    
    else:
        return 1

def get_article_links(page, target_date):
    response = requests.get(base_url, params={"page": page, "regDate": target_date}, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    article_tags = soup.select("ul.list_news2.list_allnews li a.link_txt")
    return [tag["href"] for tag in article_tags]

def get_article_content(url):
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    title_tag = soup.select_one("h3.tit_view")
    title = title_tag.text if title_tag else "제목 없음"
    date_tag = soup.select_one("span.num_date")
    date_text = date_tag.text.strip() if date_tag else None
    formatted_date = None

    if date_text:
        date_obj = datetime.strptime(date_text, "%Y. %m. %d. %H:%M")
        formatted_date = date_obj.strftime("%Y%m%d")

    if re.match(r'^[a-zA-Z0-9\s]*$', title_tag.text):
        return None

    tokens = extract_meaningful_tokens(title)
    return {"title": title, "tokens": tokens, "date":formatted_date}

def crawl_daum_news(target_date):
    last_page = get_last_page(target_date)
    articles = []
    
    for page in range(1, last_page + 1, max(1, last_page // 200)):
        article_links = get_article_links(page, target_date)
        
        for url in article_links:
            article = get_article_content(url)
            if article and article["tokens"]:
                send_to_kafka(article)
                articles.append(article)
        time.sleep(0.6)
    
    return articles

def crawl_daum_news_all():
    start_date = datetime(datetime.now().year, 11, 12)
    end_date = datetime.now() - timedelta(days=1)
    current_date = start_date

    while current_date <= end_date:
        target_date = current_date.strftime("%Y%m%d")
        crawl_daum_news(target_date)
        current_date += timedelta(days=1)

def handle_crawl_news_all_request():
    crawl_daum_news_all()