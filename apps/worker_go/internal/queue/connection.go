package queue

import (
	"fmt"
	"time"
	"worker/internal/log"

	"github.com/rabbitmq/amqp091-go"
)

func ConnectWithRetry(url string, retries int, delay time.Duration) (*amqp091.Connection, error) {
	var conn *amqp091.Connection
	var err error

	for i := 1; i <= retries; i++ {
		log.Info(fmt.Sprintf("Tentando conectar ao RabbitMQ (%d/%d)...", i, retries))
		conn, err = amqp091.Dial(url)
		if err == nil {
			log.Info("Conectado ao RabbitMQ!")
			return conn, nil
		}

		log.Error(err)
		time.Sleep(delay)
	}

	return nil, fmt.Errorf("não foi possível conectar ao RabbitMQ")
}
