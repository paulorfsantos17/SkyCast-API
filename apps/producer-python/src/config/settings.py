class Settings:
  LATITUDE: float =  -22.2341
  LONGITUDE: float = -45.9332
  
  RABBITMQ_HOST = 'rabbitmq'
  RABBITMQ_USER = 'guest'
  RABBITMQ_PASS = 'guest'
  RABBITMQ_PORT = 5672
  QUEUE_NAME = 'weather_data'
  
  INTERVAL_SECONDS = 10
  

settings = Settings()