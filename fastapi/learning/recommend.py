from transformers import AutoTokenizer, AutoModel
import uuid
from scipy.spatial.distance import cosine
import torch
from elasticsearch import Elasticsearch

# KcElectra 모델 로드
tokenizer = AutoTokenizer.from_pretrained("beomi/KcELECTRA-base-v2022")
model = AutoModel.from_pretrained("beomi/KcELECTRA-base-v2022")

# 단어 임베딩 벡터 생성 함수
def generate_embedding(token):
    if not isinstance(token, str):
        token = str(token)

    inputs = tokenizer(token, return_tensors="pt", add_special_tokens=True)
    with torch.no_grad():
        outputs = model(**inputs)
        embedding = outputs.last_hidden_state[:, 0, :].squeeze().numpy()
    return embedding.tolist()

# 임베딩을 Elasticsearch에 업데이트
def save_token(token, es):
    new_embedding = generate_embedding(token)
    
    # 기존 임베딩 벡터 조회
    search_query = {
        "query": {
            "term": {
                "token": token
            }
        }
    }

    existing_docs = es.search(index="news-token", body=search_query)
    found_similar = False  # 중복 여부를 추적하기 위한 플래그
    # 기존 벡터들과 중복 확인
    for doc in existing_docs["hits"]["hits"]:
        doc_id = doc["_id"]
        existing_embedding = doc["_source"]["embedding_vector"]
        
        # 코사인 유사도 계산
        similarity = 1 - cosine(existing_embedding, new_embedding)
        
        # 유사도가 높으면 count 증가
        if similarity >= 0.99:
            es.update(
                index="news-token",
                id=doc_id,
                body={
                    "script": {
                        "source": "ctx._source.count += 1",  # count를 +1 증가
                        "lang": "painless"
                    }
                }
            )
            found_similar = True
            break

    if not found_similar:
        doc_id = str(uuid.uuid4())
        es.index(
            index="news-token",
            id=doc_id,
            body={
                "token": token,
                "embedding_vector": new_embedding,
                "count": 1
            }
        )