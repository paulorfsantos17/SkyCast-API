from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    
    RABBITMQ_HOST: str = 'rabbitmq'
    RABBITMQ_USER: str = 'guest'
    RABBITMQ_PASS: str = 'guest'
    RABBITMQ_PORT: int = 5672
    QUEUE_NAME: str = 'weather_data'
    
    INTERVAL_SECONDS: int = 60
    
    REDIS_HOST: str = 'redis'
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str | None = None
    LOCATIONS_CACHE_KEY: str = 'active_locations'
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'


settings = Settings()