import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { WeatherRepository } from "src/contexts/weather/application/repositories/weather-repository";
import { WeatherLog } from "src/contexts/weather/domain/entities/weather-log";
import type { WeatherLogDocument } from "src/infra/database/schemas/weather-log-schema";


@Injectable()
export class MongoWeatherLogRepository implements WeatherRepository {
  constructor(
    @InjectModel(WeatherLog.name)
    private model: Model<WeatherLogDocument
    >
  ) {}

  findById(id: string): Promise<WeatherLog | null> {
    throw new Error("Method not implemented.");
  }

  async save(data: WeatherLog): Promise<void> {
    await this.model.create({
      humidity: data.humidity
      , temperature: data.temperature
      , windSpeed: data.windSpeed
      , condition: data.condition
      , rainProbability: data.rainProbability
      , timestamp: data.timestamp
  }) }

  async findAll(): Promise<WeatherLog[]> {
    const data = await this.model.find();
    return data.map((d) => WeatherLog.create(d as any, d._id.toString()));
  }
}