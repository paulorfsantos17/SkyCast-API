import { Inject, Injectable, OnModuleDestroy, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Response } from 'express';
import { GetWeatherLogs } from 'src/contexts/weather/application/use-cases/get-weather-logs';
import { WeatherLog } from '../../../domain/entities/weather-log';

interface SseClient {
  locationId: string;
  res: Response;
}

@Injectable()
export class WeatherSseGateway implements OnModuleDestroy {
  private clients = new Set<SseClient>();

  constructor(
    @Inject(forwardRef(() => GetWeatherLogs))
    private readonly getWeatherLogs: GetWeatherLogs,
  ) {}

  async addClient(locationId: string, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const client: SseClient = { locationId, res };
    this.clients.add(client);

    res.on('close', () => {
      this.clients.delete(client);
    });

    // envia logs iniciais assim que conectar
    const result = await this.getWeatherLogs.execute({ locationId });
    const logs = result?.data ?? result ?? [];

    res.write(`event: initial\ndata: ${JSON.stringify(logs)}\n\n`);
  }

  @OnEvent('weather.log.created')
  handleLogCreated(payload: { log: WeatherLog }) {
    const { log } = payload;

    const dto = {
      id: log.id,
      temperature: log.temperature,
      humidity: log.humidity,
      windSpeed: log.windSpeed,
      condition: log.condition,
      rainProbability: log.rainProbability,
      timestamp: log.timestamp,
      locationId: log.locationId,
    };

    for (const client of this.clients) {
      if (client.locationId === log.locationId) {
        client.res.write(`event: update\ndata: ${JSON.stringify(dto)}\n\n`);
      }
    }
  }

  onModuleDestroy() {
    for (const client of this.clients) {
      client.res.end();
    }
    this.clients.clear();
  }
}