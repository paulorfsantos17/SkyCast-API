import { WeatherLog } from "../../domain/entities/weather-log";

export abstract class WeatherRepository {
  abstract save(weather: WeatherLog): Promise<void>;
  abstract findAll(): Promise<WeatherLog[]>;
  abstract findById(id: string): Promise<WeatherLog | null>;
}