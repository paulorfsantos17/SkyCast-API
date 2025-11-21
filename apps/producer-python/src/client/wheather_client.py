import requests
from src.config.settings import settings


def get_weather_data():
  
  url_base = "https://api.open-meteo.com/v1/forecast"
  
  params  = {
    "latitude": settings.LATITUDE,
    "longitude": settings.LONGITUDE,
    "current": "temperature_2m,relative_humidity_2m,windspeed_10m,weathercode,precipitation_probability",
    "timezone": "America/Sao_Paulo"
}
  
  try:
    response = requests.get(url_base, params=params,timeout=10)
    response.raise_for_status()
    return response.json()
  
  except requests.exceptions.RequestException as e:
    print(f"Error fetching weather data: {e}")
    return None