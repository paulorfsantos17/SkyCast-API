import { Injectable } from "@nestjs/common";
import { WeatherLog } from "../../domain/entities/weather-log";
import { CreateWeatherLogDTO } from "../../infra/dtos/create-weather-log-dto";
import { WeatherRepository } from "../repositories/weather-repository";

@Injectable()
export class CreateWeatherLogUseCase {
  constructor(private readonly repository: WeatherRepository) {}

  async execute(data: CreateWeatherLogDTO) {
    const weather = WeatherLog.create({
      temperature: data.temperature,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
      condition: data.condition,
      rainProbability: data.rainProbability,
      timestamp: data.timestamp,
    });

    await this.repository.save(weather);

    return { id: weather.id };
  }
}