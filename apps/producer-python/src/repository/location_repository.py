# src/repository/location_repository.py
import json
import logging

import redis
from src.config.settings import settings

logger = logging.getLogger(__name__)


class LocationRepository:

    def __init__(self):
        self._client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD,
            decode_responses=True,
        )

    def get_locations(self) -> list[dict]:
        try:
            data = self._client.get(settings.LOCATIONS_CACHE_KEY)

            if not data:
                logger.warning("Nenhuma localização encontrada no Redis.")
                return []

            locations = json.loads(data)
            logger.info(f"{len(locations)} localização(ões) carregada(s) do Redis.")
            return locations

        except redis.RedisError as e:
            logger.error(f"Erro ao conectar ao Redis: {e}")
            return []