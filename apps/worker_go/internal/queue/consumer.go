package queue

import (
    "encoding/json"
    "fmt"
    "worker/internal/models"
    "worker/internal/service"
    amqp "github.com/rabbitmq/amqp091-go"
)

func Consume(ch *amqp.Channel, queueName string) error {


    messages, err := ch.Consume(
        queueName,
        "worker_go",
        true,
        false,
        false,
        false,
        nil,
    )
    if err != nil {
        return err
    }

    for msg := range messages {
        fmt.Printf("📦 Mensagem recebida: %s\n", string(msg.Body))
        var weatherMsgBroken models.WeatherMessageBroken 
        err := json.Unmarshal(msg.Body, &weatherMsgBroken)
        if err != nil {
            fmt.Printf("❌ Erro ao deserializar mensagem: %v\n", err)
            continue
        }
        fmt.Printf("✅ Mensagem deserializada: %v\n", weatherMsgBroken)

        weatherMsg := models.WeatherMessage{
            Temperature: weatherMsgBroken.Temperature,
			Humidity: weatherMsgBroken.Humidity,
			WindSpeed: weatherMsgBroken.WindSpeed,
			Condition: weatherMsgBroken.Condition,
			RainProbability: weatherMsgBroken.RainProbability,
			Timestamp: weatherMsgBroken.Timestamp,
            Location: weatherMsgBroken.Location,
            LocationId: weatherMsgBroken.LocationId,
        }

        go service.ProcessWeatherData(weatherMsg)
    }
    return nil
}
