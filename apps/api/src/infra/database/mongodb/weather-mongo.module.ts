import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoWeatherLogRepository } from 'src/contexts/weather/infra/repositories/mongo/mongo-weather-log-repository';
import { WeatherLog, WeatherLogSchema } from 'src/infra/database/schemas/weather-log-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WeatherLog.name,
        schema: WeatherLogSchema,
      },
    ]),
  ],
  providers: [MongoWeatherLogRepository],
  exports: [MongoWeatherLogRepository, MongooseModule],
})
export class WeatherMongoModule {}