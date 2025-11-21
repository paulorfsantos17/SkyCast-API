import time

from src.client.wheather_client import get_weather_data
from src.config.settings import settings
from src.normalizer.weather_normalizer import normalize_weather_data
from src.publisher.message_publisher import MessagePublisher


def main_loop():
    publisher = MessagePublisher()
    try:
        while True:
            try:
                raw_data = get_weather_data()
                weather = normalize_weather_data(raw_data)
                publisher.publish(weather)
            except Exception as e:
                print(f"Erro ao coletar/enviar dados: {e}")
            time.sleep(settings.INTERVAL_SECONDS)
    finally:
        publisher.close()

if __name__ == "__main__":
    main_loop()