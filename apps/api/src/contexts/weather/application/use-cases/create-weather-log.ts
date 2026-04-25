import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WeatherLog } from "../../domain/entities/weather-log";
import { CreateWeatherLogDTO } from "../../infra/dtos/create-weather-log-dto";
import { WeatherRepository } from "../repositories/weather-repository";

@Injectable()
export class CreateWeatherLogUseCase {
  constructor(
    private readonly repository: WeatherRepository, 
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(data: CreateWeatherLogDTO) {

    const weather = WeatherLog.create({
      temperature: data.temperature,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
      condition: data.condition,
      rainProbability: data.rainProbability,
      timestamp: new Date().toISOString(),
      locationId: data.locationId
    });


    await this.repository.save(weather);

      this.eventEmitter.emit('weather.log.created', { log: weather });



    return { id: weather.id };
  }
}