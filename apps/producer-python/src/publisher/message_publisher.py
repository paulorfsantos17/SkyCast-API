import json
import time

import pika
from src.config.settings import settings


class MessagePublisher:
    def __init__(self, max_retries=10, retry_delay=5):
        # Agora usa o retry corretamente
        self.connection = self._connect_with_retry(max_retries, retry_delay)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=settings.QUEUE_NAME)

    def _connect_with_retry(self, max_retries, retry_delay):
        credentials = pika.PlainCredentials(
            settings.RABBITMQ_USER,
            settings.RABBITMQ_PASS,
        )

        params = pika.ConnectionParameters(
            host=settings.RABBITMQ_HOST,
            port=settings.RABBITMQ_PORT,
            credentials=credentials,
        )

        retries = 0
        while retries < max_retries:
            try:
                print(f"[Publisher] Tentando conectar ao RabbitMQ... ({retries+1}/{max_retries})")
                connection = pika.BlockingConnection(params)
                print("[Publisher] Conectado com sucesso ao RabbitMQ!")
                return connection

            except pika.exceptions.AMQPConnectionError as e:
                print(f"[Publisher] Falha na conexão: {e}. Tentando novamente em {retry_delay}s...")
                retries += 1
                time.sleep(retry_delay)

        raise Exception("Não foi possível conectar ao RabbitMQ após múltiplas tentativas.")

    def publish(self, message: dict):
        self.channel.basic_publish(
            exchange="",
            routing_key=settings.QUEUE_NAME,
            body=json.dumps(message),
        )
        print(f"[Publisher] Mensagem enviada para fila ({settings.QUEUE_NAME}): {message.get('timestamp')}")

    def close(self):
        self.connection.close()
