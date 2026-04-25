import { Injectable } from '@nestjs/common';
import { WeatherRepository } from '../repositories/weather-repository';

export interface GetWeatherLogsByLocationIDParams {
  locationId: string;
}

@Injectable()
export class GetWeatherLogs {
  constructor(private weatherRepository: WeatherRepository) {}

  async execute(params: GetWeatherLogsByLocationIDParams) {
    const { locationId } = params;

    const result = await this.weatherRepository.findAllByLocationId(locationId);
  return {
      data: result
    };
  }
}
