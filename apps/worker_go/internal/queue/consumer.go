package queue

import (
	"encoding/json"
	"fmt"
	"time"

	"worker/internal/log"
	"worker/internal/models"
	"worker/internal/service"

	amqp "github.com/rabbitmq/amqp091-go"
)

func Consume(ch *amqp.Channel, queueName string) error {

	// Aguarda a fila existir
	for i := 1; i <= 20; i++ {
		_, err := ch.QueueDeclarePassive(
			queueName,
			true,
			false,
			false,
			false,
			nil,
		)

		if err == nil {
			fmt.Printf("[Queue] Fila '%s' encontrada!\n", queueName)
			break
		}

		fmt.Printf("[Queue] Fila '%s' ainda não existe. Tentativa %d/20...\n", queueName, i)
		time.Sleep(2 * time.Second)

		if i == 20 {
			return fmt.Errorf("fila '%s' não encontrada após múltiplas tentativas", queueName)
		}
	}

	// Agora sim, consumir
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
	}

	return nil
}

