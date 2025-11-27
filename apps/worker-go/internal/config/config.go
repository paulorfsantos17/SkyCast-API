package config

import "os"

type Config struct {
	RabbitURL  string
	QueueName  string
}

func Load() *Config {
	return &Config{
		RabbitURL: os.Getenv("RABBITMQ_URL"),
		QueueName: os.Getenv("QUEUE_NAME"),
	}
}