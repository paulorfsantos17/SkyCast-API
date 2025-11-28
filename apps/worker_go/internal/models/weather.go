package models

type WeatherMessage struct {
    Temperature       float64 `json:"temperature"`
    Humidity          float64 `json:"humidity"`
    WindSpeed         float64 `json:"wind_speed"`
    Condition         string  `json:"condition"`
    RainProbability   float64 `json:"rain_probability"`
    Timestamp         string  `json:"timestamp"`
}