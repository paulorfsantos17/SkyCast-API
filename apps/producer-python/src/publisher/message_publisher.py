import json

import pika
from src.config.settings import settings


class MessagePublisher:
    def __init__(self):
        credentials = pika.PlainCredentials('guest', 'guest') 
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(settings.RABBITMQ_HOST, credentials=credentials))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue= settings.QUEUE_NAME)

    def publish(self, message: dict):
        self.channel.basic_publish(
            exchange='',
            routing_key= settings. QUEUE_NAME,
            body=json.dumps(message)
        )
        print(f"Mensagem enviada para fila: {message['timestamp']}")

    def close(self):
        self.connection.close()