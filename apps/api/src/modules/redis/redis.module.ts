// src/infra/redis/redis.module.ts
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { RedisService } from 'src/contexts/weather/application/services/redis.service';

const redisHost = process.env.REDIS_HOST || 'localhost';

const redisPort = process.env.REDIS_PORT || '6379';

const redisUrl = `redis://${redisHost}:${redisPort}`;

console.log('Redis connection URL being used by NestJS:', redisUrl);


@Module({
  imports: [
    NestRedisModule.forRoot({
      type: 'single',
      url: redisUrl,
    }),
  ],
  providers: [RedisService], 
  exports: [RedisService],
})
export class RedisModule {}
