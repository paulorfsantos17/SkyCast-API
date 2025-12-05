package config

import "os"

type Config struct {
	RabbitURL  string
	QueueName  string
	WeaterApiUrl string
}

func Load() *Config {
	return &Config{
		RabbitURL: os.Getenv("RABBITMQ_URL"),
		QueueName: os.Getenv("QUEUE_NAME"),
		WeaterApiUrl: os.Getenv("WEATHER_API_URL"),
	}
}