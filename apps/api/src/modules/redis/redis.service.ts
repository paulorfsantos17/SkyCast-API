import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, expiresIn?: number): Promise<void> {
    if (expiresIn) {
      await this.redis.setex(key, expiresIn, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async getClient(): Promise<Redis> {
    return this.redis;
  }

  // helpers para JSON — usados pelo repositório de location
  async setJson(key: string, value: any, expiresIn?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), expiresIn);
    this.logger.debug(`SET JSON → ${key}`);
  }

  async getJson<T = any>(key: string): Promise<T | null> {
    const data = await this.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }
}