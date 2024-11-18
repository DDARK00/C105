import json
from confluent_kafka import Producer, KafkaError

KAFKA_BROKER_URL = "Kafka00Service:9092"
TOPIC = "news_topic"

conf = {'bootstrap.servers': KAFKA_BROKER_URL}
producer = Producer(conf)

def send_to_kafka(article):
    try:
        producer.produce(TOPIC, key=str(article["title"]), value=json.dumps(article, ensure_ascii=False))
        print(article["date"])
        producer.flush()
    except KafkaError as e:
        print(f"Kafka Error: {e}")