import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { FindAllParams, FindAllResult, WeatherRepository } from "src/contexts/weather/application/repositories/weather-repository";
import { WeatherLog } from "src/contexts/weather/domain/entities/weather-log";
import type { WeatherLogDocument } from "src/infra/database/schemas/weather-log-schema";
import { WeatherLogMapper } from "./mappers/weather-log-mappers";


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

  Copiar

async findAll(params: FindAllParams = {}): Promise<FindAllResult> {
  const { limit = 100, skip = 0, sort = { timestamp: -1 } } = params;

  const rawData = await this.model
    .find()
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();

  const total = await this.model.countDocuments().exec();

  const data = WeatherLogMapper.toDomainMany(rawData);

  return {
    data,
    total,
    limit,
    skip,
  };
}


}