package service

import (
	"worker/internal/log"
	"worker/internal/models"
)


func ProcessWeatherData(data WeatherMessage) {
	log.Info("Processando dados do clima...")

	// Aqui depois você envia para API NestJS
	// httpclient.SendToApi(data)
}