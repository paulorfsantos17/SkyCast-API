package httpclient

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"worker/internal/models"
)

var httpClient = &http.Client{
	Timeout: 10 * time.Second,
}

func SendWeatherToAPI(url string, body models.WeatherMessage) error {


	jsonData, err := json.Marshal(body)
	if err != nil {
		return fmt.Errorf("erro ao converter para JSON: %w", err)
	}
	fmt.Println("📤 Enviando dados para API...", string(jsonData))

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("erro ao criar request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("erro ao enviar request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf("API respondeu com erro: %s", resp.Status)
	}

	fmt.Println("✅ Dados enviados com sucesso!")
	return nil
}