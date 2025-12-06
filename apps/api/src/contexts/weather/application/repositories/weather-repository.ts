import { WeatherLog } from "../../domain/entities/weather-log";

export interface FindAllParams {
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}

export interface FindAllResult {
  data: WeatherLog[];
  total: number;
  limit: number;
  skip: number;
}

export abstract class WeatherRepository {
  abstract save(weather: WeatherLog): Promise<void>;
  abstract findAll(params?: FindAllParams): Promise<FindAllResult>;
  abstract findById(id: string): Promise<WeatherLog | null>;
}