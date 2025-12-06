import sys
import time

from src.client.wheather_client import get_weather_data
from src.config.settings import settings
from src.normalizer.weather_normalizer import normalize_weather_data
from src.publisher.message_publisher import MessagePublisher


def main_loop():
    publisher = MessagePublisher()
    
    print("=" * 60)
    print("🚀 Weather Producer iniciado")
    print(f"📋 Intervalo de coleta: {settings.INTERVAL_SECONDS} segundos ({settings.INTERVAL_SECONDS/60:.1f} minutos)")
    print(f"🌍 Localização: {settings.LATITUDE}, {settings.LONGITUDE}")
    print(f"📨 Fila RabbitMQ: {settings.QUEUE_NAME}")
    print("=" * 60)
    sys.stdout.flush()
    
    try:
        while True:
            try:
                print(f"\n🌤️  Coletando dados do clima...")
                sys.stdout.flush()
                
                raw_data = get_weather_data()
                weather = normalize_weather_data(raw_data)
                
                print(f"📊 Dados coletados: Temp={weather.get('temperature')}°C, "
                    f"Umidade={weather.get('humidity')}%, "
                    f"Condição={weather.get('condition')}")
                sys.stdout.flush()
                
                publisher.publish(weather)
                
                print(f"✅ Sucesso! Próxima coleta em {settings.INTERVAL_SECONDS}s")
                print("-" * 60)
                sys.stdout.flush()
                
            except KeyboardInterrupt:
                print("\n⚠️  Interrupção recebida (Ctrl+C)")
                break
                
            except Exception as e:
                print(f"❌ Erro ao coletar/enviar dados: {e}")
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