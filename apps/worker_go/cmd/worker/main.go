package main

import (
	"log"
	"time"
	"fmt"

	"worker/internal/config"
	"worker/internal/queue"
)

func main() {
	cfg := config.Load()

	fmt.Println(cfg.QueueName)

	if cfg.RabbitURL == "" {
		log.Fatal("RABBITMQ_URL não definido")
	}

	conn, err := queue.ConnectWithRetry(cfg.RabbitURL, 10, 10*time.Second)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal(err)
	}
	defer ch.Close()



	err = queue.Consume(ch, "weather_data")
	if err != nil {
    log.Fatal("Erro ao consumir:", err)
	}
}