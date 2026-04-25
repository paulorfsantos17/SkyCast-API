// apps/api/src/modules/redis/redis.module.ts
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    NestRedisModule.forRootAsync({
      imports: [ConfigModule], // ← resolve o problema do ConfigService
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('REDIS_HOST', 'localhost');
        const port = config.get<string>('REDIS_PORT', '6379');
        const url = `redis://${host}:${port}`;

        console.log('Redis connection URL:', url);

        return { type: 'single', url };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}