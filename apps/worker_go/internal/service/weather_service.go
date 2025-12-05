package service

import (
	"errors"
	"fmt"
	"strings"

	"worker/internal/httpclient"
	"worker/internal/log"
	"worker/internal/models"
	"worker/internal/config"
)

func ProcessWeatherData(data models.WeatherMessage) {
	log.Info("Processando dados do clima...")
	cfg := config.Load()

	apiURL := cfg.WeaterApiUrl

	if apiURL == "" {
		log.Error(errors.New("WEATHER_API_URL não definida"))
		return
	}

	// Ajustar timestamp para formato ISO 8601 completo
	if data.Timestamp != "" {
		// Adicionar segundos se necessário
		if len(data.Timestamp) == 16 {
			data.Timestamp = data.Timestamp + ":00"
		}
		// Adicionar timezone Z se não tiver
		if !strings.HasSuffix(data.Timestamp, "Z") {
			data.Timestamp = data.Timestamp + "Z"
		}
	}

	err := httpclient.SendWeatherToAPI(apiURL, data)
	if err != nil {
		log.Error(fmt.Errorf("Erro ao enviar para API: %w", err))
		return
	}

	log.Info("Dados enviados para API com sucesso!")
}