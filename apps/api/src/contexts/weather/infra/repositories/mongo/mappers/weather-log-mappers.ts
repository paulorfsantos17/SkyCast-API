import { WeatherLog } from 'src/contexts/weather/domain/entities/weather-log';

export class WeatherLogMapper {
  static toDomain(raw: any): WeatherLog {
    return WeatherLog.create(
      {
        temperature: raw.temperature,
        humidity: raw.humidity,
        windSpeed: raw.windSpeed,
        condition: raw.condition,
        rainProbability: raw.rainProbability,
        timestamp: raw.timestamp,
        locationId: raw.locationId,
      },
      raw._id?.toString(),
    );
  }

  static toDomainMany(raw: any[]): WeatherLog[] {
    return raw.map((item) => this.toDomain(item));
  }
}