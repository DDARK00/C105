from transformers import AutoTokenizer, AutoModel
import json
import re
import torch
from openai import OpenAI
from datetime import datetime, timedelta
from fastapi import HTTPException
from konlpy.tag import Okt
from collections import Counter

okt = Okt()

# KcElectra 모델 로드
tokenizer = AutoTokenizer.from_pretrained("beomi/KcELECTRA-base-v2022")
model = AutoModel.from_pretrained("beomi/KcELECTRA-base-v2022")

def tokenize_input(sentence):
    # 입력 문장을 형태소 분석기로 토큰화 (명사 추출)
    tokens = okt.nouns(sentence)
    return tokens

def extract_related_words(news_hits, excluded_tokens):
    # 검색된 뉴스에서 tokens 필드 추출
    all_tokens = []
    for hit in news_hits:
        all_tokens.extend(hit["_source"]["tokens"])
    
    # 단어 빈도 계산
    token_counter = Counter(all_tokens)

    # 제외할 토큰 제거
    for token in excluded_tokens:
        if token in token_counter:
            del token_counter[token]

    return token_counter.most_common(10)

def search_related_news(es, tokens):
    # ElasticSearch 쿼리 생성
    query = {
        "size": 10,
        "query": {
            "bool": {
                "should": [
                    {"match": {"tokens": token}} for token in tokens
                ]
            }
        }
    }

    # 검색 실행
    response = es.search(index="news-topic", body=query)
    return response["hits"]["hits"]

def recommend_words(sentence, es):
    # 입력 문장 토큰화
    tokens = tokenize_input(sentence)
    
    if not tokens:
        return {"error": "No valid tokens found in the input."}
    
    # ElasticSearch에서 관련 뉴스 검색
    news_hits = search_related_news(es, tokens)

    if not news_hits:
        return {"error": "No related news found in ElasticSearch."}
    
    # 연관 단어 추출 (입력된 토큰 제외)
    related_words = extract_related_words(news_hits, excluded_tokens=set(tokens+["대사", "지원", "감독", "현장", "경기", "최고", "인사", "전국", "시작", "올해", "추진", "투자", "연속", "시장", "세계", "지역", "최대", "국민", "테크", "어닝", "실적", "서학", "시즌", "지난해", "논의", "언론", "공화", "개정", "지지", "끝내", "경선", "집권", "초반", "대세", "개표", "구독", "상조", "라이프", "산업", "에듀", "케이", "학교", "송치", "트럭", "관계자", "전문", "일요일", "목요일", "월요일", "토요일", "화요일", "수요일", "금요일", "잡기", "실률", "사촌", "마을", "사내", "온전", "부유", "전보", "검토", "정신", "이름", "심의", "투표", "도중", "이슈", "처럼"]))
    return [word for word, freq in related_words]

# 단어 임베딩 벡터 생성 함수
def generate_embedding(token):
    if not isinstance(token, str):
        token = str(token)

    inputs = tokenizer(token, return_tensors="pt", add_special_tokens=True)
    with torch.no_grad():
        outputs = model(**inputs)
        embedding = outputs.last_hidden_state[:, 0, :].squeeze().numpy()
    return embedding.tolist()

def hybrid_search(keyword, es, alpha=0.90):
    keyword_embedding = generate_embedding(f"{keyword}")
    
    knn_query = {
        "size": 50,  # 상위 50개 후보군 (임베딩 유사도 기반 검색)
        "query": {
            "script_score": {
                "query": {"match_all": {}},
                "script": {
                    "source": "cosineSimilarity(params.query_vector, 'embedding_vector') + 1.0",
                    "params": {"query_vector": keyword_embedding}
                }
            }
        }
    }
    response = es.search(index="news-token", body=knn_query)
    recommended_tokens = []
    max_count = max(hit["_source"]["count"] for hit in response["hits"]["hits"])

    for hit in response["hits"]["hits"]:
        token = hit["_source"]["token"]
        
        # keyword와 동일한 단어는 제외
        if token == keyword:
            continue
        
        similarity_score = hit["_score"] - 1.0 
        
        # 빈도수 점수 계산 및 정규화
        count = hit["_source"]["count"]
        frequency_score = count / max_count if max_count > 0 else 0  # 빈도수 점수를 0과 1 사이로 정규화
        
        # 결합 점수 계산
        combined_score = alpha * similarity_score + (1 - alpha) * frequency_score
        recommended_tokens.append((token, combined_score))

    # 결합 점수로 정렬하여 상위 10개 추천
    recommended_tokens = sorted(recommended_tokens, key=lambda x: x[1], reverse=True)[:10]
    unique_recommended_tokens = list(dict.fromkeys([token for token, _ in recommended_tokens]))

    return unique_recommended_tokens[:10]  # 상위 10개의 유니크한 추천 결과 반환


def get_top_tokens_last_7_days(es):
    # 현재 시간 기준으로 7일 전 날짜 계산
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)

    query = {
            "size": 0,  # 문서 자체는 가져오지 않고 집계 결과만 필요
            "query": {
                "bool": {
                    "filter": [
                        {
                            "range": {
                                "date": {
                                    "gte": start_date.strftime("%Y%m%d"),
                                    "lte": end_date.strftime("%Y%m%d")
                                }
                            }
                        }
                    ]
                }
            },
            "aggs": {
                "top_tokens": {
                    "terms": {
                        "field": "tokens",   # 배열 내 개별 단어를 집계 대상으로 설정
                        "size": 10,         # 상위 n개 단어
                        "order": {"_count": "desc"} # 빈도수 기준 정렬
                    }
                }
            }
        }
    
    # Elasticsearch 검색 실행
    response = es.search(index="news-topic", body=query)
    # print(response)
    
    # 상위 토큰 추출
    top_tokens = [bucket["key"] for bucket in response["aggregations"]["top_tokens"]["buckets"]]
    
    return top_tokens

def createAIPlanner(OPEN_AI_KEY, payload_dict:dict):
    client = OpenAI(
        api_key = OPEN_AI_KEY
    )
    # 프롬프트 구성
    prompt = f"""
    You are an AI assistant responsible for drafting a professional and comprehensive project proposal summary. Your goal is to write a highly detailed response with the same depth and clarity as the provided examples. For each section, deliver a clear, structured, and insightful summary that explains the project’s purpose, core components, and expected impact. Make the content sophisticated and meaningful, using high-level language, logical flow, and ensuring each section is well-developed with nuanced, domain-specific details.
    
    Please return the response in the following JSON format in Korean:
    
    {{
        "background": "Sophisticated 1-3 sentence summary for background in Korean, including project motivations, relevant challenges, and the problem it seeks to solve.",
        "introduction": "Detailed 1-3 sentence summary for service introduction in Korean, emphasizing the core service goals and key features with domain-specific insights.",
        "target": "1-3 sentence summary for target users in Korean, clearly explaining user benefits and how each user group gains value from the service.",
        "expectedEffect": "Well-developed 1-3 sentence summary for expected effects in Korean, summarizing anticipated impacts on users and the broader industry/society.",
        "projectTopic": "6-9 sentence summary recommending three nuanced, domain-specific project topics suitable for six junior developers, highlighting key points for each topic in sophisticated language.",
        "techStack": "In-depth 6-sentence summary recommending a tech stack for each topic, tailored to the project goals and featuring notable frameworks, libraries, and technologies.",
        "advancedStack": "Challenging tech stack recommendations with advanced options for each topic, including libraries or CS-based technologies with concise, meaningful descriptions."
    }}
    
    Detailed guidelines for each section:
    
    1. **Background**: 
       - Provide a nuanced, sophisticated description of the project's motivation, background, and necessity.
       - Connect the problem being addressed to the project’s purpose, emphasizing why this service is essential for the target audience.
       - Use the following keywords to shape this section: {", ".join(payload_dict["background"])}.
    
    2. **Service Introduction**: 
       - Give a well-developed overview of the service's main goals and features, emphasizing their value and role in addressing the problem.
       - Explain how each main feature contributes to solving the problem or achieving the project’s goals, using high-level terminology to avoid repetitive phrasing.
    
    3. **Target Users**: 
       - Identify the primary user groups for this service and describe how each group will benefit, focusing on how this service addresses specific user needs.
       - Relate each user group’s benefits to the project’s objectives, explaining how they gain lasting value from this service.
    
    4. **Expected Effects**: 
       - Summarize the anticipated impacts of this project in a nuanced way, including specific improvements, awareness, or behavioral changes it aims to foster.
       - Describe the broader societal or industry impact expected from this project, using the following keywords: {", ".join(payload_dict["expected_effects"])}.
    
    5. **Project Topics**: 
       - Based on the content above, recommend three project topics suitable for six junior developers.
       - Briefly describe each topic in sophisticated language, with key points that give each topic depth and structure.
    
    6. **Tech Stack Recommendations**: 
       - For each recommended topic in section 5, provide an in-depth description of the basic tech stack.
       - Include one-sentence descriptions of each component, emphasizing their relevance to the project and why they are suitable.
    
    7. **Challenging Stack/Technology Recommendations**: 
       - Recommend a more challenging tech stack for each topic, featuring creative options or CS-based technologies.
       - Describe each recommended technology with concise yet sophisticated explanations that highlight their advanced uses.
    """


    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an AI assistant that drafts concise project proposal summaries. Each section (Background, Service Introduction, Target Users, Expected Effects) must be filled out with meaningful content."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )
    
    text_response = response.choices[0].message.content.strip()

    json_match = re.search(r'(\{.*\})', text_response, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        try:
            response_dict = json.loads(json_str)
        except json.JSONDecodeError:
            print("JSON 파싱 에러 발생 - 올바른 JSON 형식으로 변환되지 않았습니다.")
            response_dict = {"background": "", "service_intro": "", "target_users": "", "expected_effects": ""}
    else:
        print("JSON 형식을 찾을 수 없음.")
        response_dict = {"background": "", "service_intro": "", "target_users": "", "expected_effects": ""}

    return response_dict