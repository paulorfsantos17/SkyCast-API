import datetime

# Mapeamento dos códigos do Open-Meteo para condição do céu
WEATHER_CONDITIONS = {
    0: "Céu limpo",
    1: "Parcialmente nublado",
    2: "Nublado",
    3: "Chuva leve",
    45: "Neblina",
    48: "Nevoeiro",
    51: "Chuvisco leve",
    53: "Chuvisco moderado",
    55: "Chuvisco forte",
    61: "Chuva leve",
    63: "Chuva moderada",
    65: "Chuva forte",
    80: "Chuva de passagem",
    81: "Chuva intensa",
    82: "Chuva muito intensa"
}

def normalize_weather_data(raw_data):
    
    time_strings = raw_data["current"]["time"]
    


    temperature = raw_data["current"]["temperature_2m"]
    humidity = raw_data["current"]["relative_humidity_2m"]
    wind_speed = raw_data["current"]["windspeed_10m"]
    weather_code = raw_data["current"]["weathercode"]
    rain_probability = raw_data["current"]["precipitation_probability"]

    condition = WEATHER_CONDITIONS.get(weather_code, "Desconhecido")

    normalized_data = {
        "temperatura": temperature,
        "umidade": humidity,
        "velocidade_vento": wind_speed,
        "condicao_ceu": condition,
        "probabilidade_chuva": rain_probability,
        "timestamp": time_strings
    }

    return normalized_data