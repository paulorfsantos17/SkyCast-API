import { Injectable } from '@nestjs/common';
import { WeatherRepository } from '../repositories/weather-repository';

export interface GetWeatherLogsParams {
  limit?: number;
  skip?: number;
  page?: number;
}

@Injectable()
export class GetWeatherLogs {
  constructor(private weatherRepository: WeatherRepository) {}

  async execute(params: GetWeatherLogsParams = {}) {
    const {
      limit = 100,
      skip,
      page,
    } = params;

    const calculatedSkip = page ? (page - 1) * limit : skip || 0;


    const result = await this.weatherRepository.findAll({
      limit,
      skip: calculatedSkip,
      sort: {timestamp :  -1},
    });

  return {
      data: result.data,
      pagination: {
        total: result.total,
        limit: result.limit,
        skip: result.skip,
      },
    };
  }
}
