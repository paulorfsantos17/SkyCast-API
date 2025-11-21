from src.client.wheather_client import get_weather_data
from src.normalizer.weather_normalizer import normalize_weather_data

data = get_weather_data()
data_normalized = normalize_weather_data(data)
print(data_normalized)