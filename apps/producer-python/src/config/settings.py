from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    LATITUDE: str = "-22.2341"
    LONGITUDE: str = "-45.9332"
    
    RABBITMQ_HOST: str = 'rabbitmq'
    RABBITMQ_USER: str = 'guest'
    RABBITMQ_PASS: str = 'guest'
    RABBITMQ_PORT: int = 5672
    QUEUE_NAME: str = 'weather_data'
    
    INTERVAL_SECONDS: int = 60
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'


settings = Settings()