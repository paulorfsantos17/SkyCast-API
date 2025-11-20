import requests
from src.config.settings import settings


def get_weather_data():
  url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={settings.LATITUDE}"
        f"&longitude={settings.LONGITUDE}"
        "&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
        "&hourly=precipitation_probability"
        "&timezone=auto"
  )
  
  try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()
  
  except requests.exceptions.RequestException as e:
    print(f"Error fetching weather data: {e}")
    return None