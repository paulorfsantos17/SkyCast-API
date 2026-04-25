import sys
import time

from src.client.wheather_client import get_weather_data
from src.config.settings import settings
from src.normalizer.weather_normalizer import normalize_weather_data
from src.publisher.message_publisher import MessagePublisher
from src.repository.location_repository import LocationRepository


def main_loop():
    publisher = MessagePublisher()
    location_repo = LocationRepository()

    print("=" * 60)
    print("🚀 Weather Producer iniciado")
    print(f"📋 Intervalo de coleta: {settings.INTERVAL_SECONDS} segundos ({settings.INTERVAL_SECONDS/60:.1f} minutos)")
    print(f"📨 Fila RabbitMQ: {settings.QUEUE_NAME}")
    print(f"🔴 Redis: {settings.REDIS_HOST}:{settings.REDIS_PORT}")
    print("=" * 60)
    sys.stdout.flush()

    try:
        while True:
            try:
                locations = location_repo.get_locations()

                if not locations:
                    print("\n⚠️  Nenhuma localização encontrada no Redis. Aguardando próximo ciclo...")
                    sys.stdout.flush()
                else:
                    print(f"\n🌍 {len(locations)} localização(ões) encontrada(s)")
                    sys.stdout.flush()

                    for location in locations:
                        lat = location["latitude"]
                        lon = location["longitude"]
                        name = location.get("name", f"{lat},{lon}")
                        id = location["id"]

                        try:
                            print(f"\n🌤️  Coletando dados para {name} ({lat}, {lon})...")
                            sys.stdout.flush()

                            raw_data = get_weather_data(lat, lon)
                            weather = normalize_weather_data(raw_data)
                            weather["location"] = name
                            weather["location_id"] = id

                            print(f"📊 Dados coletados: Temp={weather.get('temperature')}°C, "
                                f"Umidade={weather.get('humidity')}%, "
                                f"Condição={weather.get('condition')}")
                            sys.stdout.flush()

                            publisher.publish(weather)
                            print(f"✅ Publicado com sucesso!")
                            sys.stdout.flush()

                        except Exception as e:
                            print(f"❌ Erro ao processar {name}: {e}")
                            sys.stdout.flush()
                            continue  # não para o loop, tenta a próxima localização

                print(f"\n⏳ Próxima coleta em {settings.INTERVAL_SECONDS}s")
                print("-" * 60)
                sys.stdout.flush()

            except KeyboardInterrupt:
                print("\n⚠️  Interrupção recebida (Ctrl+C)")
                break

            except Exception as e:
                print(f"❌ Erro geral no ciclo: {e}")
                print(f"🔄 Tentando novamente em {settings.INTERVAL_SECONDS}s")
                sys.stdout.flush()

            time.sleep(settings.INTERVAL_SECONDS)

    finally:
        publisher.close()
        print("👋 Producer encerrado com sucesso")
        sys.stdout.flush()


if __name__ == "__main__":
    try:
        main_loop()
    except KeyboardInterrupt:
        print("\n👋 Finalizando...")
        sys.exit(0)
    except Exception as e:
        print(f"💥 ERRO FATAL: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)