import { WeatherLog } from "../../domain/entities/weather-log";


export abstract class WeatherRepository {
  abstract save(weather: WeatherLog): Promise<void>;
  abstract findById(id: string): Promise<WeatherLog | null>;
  abstract findAllByLocationId(locationId: string): Promise<WeatherLog[]>
}