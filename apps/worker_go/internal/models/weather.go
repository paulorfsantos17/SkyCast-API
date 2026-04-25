package models
type WeatherMessageBroken struct {
    Temperature       float64 `json:"temperature"`
    Humidity          float64 `json:"humidity"`
    WindSpeed         float64 `json:"wind_speed"`
    Condition         string  `json:"condition"`
    RainProbability   float64 `json:"rain_probability"`
    Location          string  `json:"location"`
    LocationId        string  `json:"location_id"`
    Timestamp         string  `json:"timestamp"`
}

type WeatherMessage struct {
    Temperature       float64 `json:"temperature"`
    Humidity          float64 `json:"humidity"`
    WindSpeed         float64 `json:"windSpeed"`
    Condition         string  `json:"condition"`
    RainProbability   float64 `json:"rainProbability"`
    Timestamp         string  `json:"timestamp"`
    Location          string  `json:"location"`
    LocationId        string  `json:"locationId"`
}