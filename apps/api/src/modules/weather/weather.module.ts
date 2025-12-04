import { Module } from '@nestjs/common';
import { WeatherRepository } from 'src/contexts/weather/application/repositories/weather-repository';
import { CreateWeatherLogUseCase } from 'src/contexts/weather/application/use-cases/create-weather-log';
import { WeatherController } from 'src/contexts/weather/infra/http/weather/weather.controller';
import { MongoWeatherLogRepository } from 'src/contexts/weather/infra/repositories/mongo/mongo-weather-log-repository';
import { WeatherMongoModule } from 'src/infra/database/mongodb/weather-mongo.module';



@Module({
  imports : [WeatherMongoModule],
  controllers: [WeatherController],
  providers: [
    CreateWeatherLogUseCase,
    {
      provide: WeatherRepository,
      useClass: MongoWeatherLogRepository,
    },
  ],

})
export class WeatherModule {}
