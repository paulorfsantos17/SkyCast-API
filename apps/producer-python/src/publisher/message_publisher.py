import json
import time

import pika
from src.config.settings import settings


class MessagePublisher:
    def __init__(self, max_retries=5, retry_delay=5):
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        # NÃO criar conexão no __init__

    def _create_connection(self):
        """Cria uma nova conexão com retry"""
        credentials = pika.PlainCredentials(
            settings.RABBITMQ_USER,
            settings.RABBITMQ_PASS,
        )

        params = pika.ConnectionParameters(
            host=settings.RABBITMQ_HOST,
            port=settings.RABBITMQ_PORT,
            credentials=credentials,
            # Sem heartbeat - conexão é efêmera
        )

        for attempt in range(1, self.max_retries + 1):
            try:
                print(f"🔌 Conectando ao RabbitMQ (tentativa {attempt}/{self.max_retries})...")
                connection = pika.BlockingConnection(params)
                print("✅ Conectado ao RabbitMQ!")
                return connection

            except pika.exceptions.AMQPConnectionError as e:
                print(f"❌ Falha na conexão: {e}")
                if attempt < self.max_retries:
                    print(f"⏳ Tentando novamente em {self.retry_delay}s...")
                    time.sleep(self.retry_delay)
                else:
                    raise Exception(f"Não foi possível conectar ao RabbitMQ após {self.max_retries} tentativas.")

    def publish(self, message: dict):
        """Cria conexão, publica mensagem e fecha imediatamente"""
        connection = None
        try:
            # Criar nova conexão
            connection = self._create_connection()
            channel = connection.channel()
            
            # Declarar fila (idempotente)
            channel.queue_declare(queue=settings.QUEUE_NAME, durable=True)
            
            # Publicar mensagem
            channel.basic_publish(
                exchange="",
                routing_key=settings.QUEUE_NAME,
                body=json.dumps(message, default=str),
                properties=pika.BasicProperties(
                    delivery_mode=2
                )
            )
            
            print(f"📤 Mensagem enviada para fila ({settings.QUEUE_NAME}): {message.get('timestamp')}")
            
        finally:
            # Sempre fechar a conexão
            if connection and not connection.is_closed:
                connection.close()
                print("🔌 Conexão fechada")

    def close(self):
        """Não precisa fazer nada - cada publish já fecha sua conexão"""
        print("👋 Publisher encerrado")