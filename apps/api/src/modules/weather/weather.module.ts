import { Module } from '@nestjs/common';
import { WeatherRepository } from 'src/contexts/weather/application/repositories/weather-repository';
import { GeminiAIService } from 'src/contexts/weather/application/services/gemini-ai.service';
import { CreateWeatherLogUseCase } from 'src/contexts/weather/application/use-cases/create-weather-log';
import { ExportWeatherLogs } from 'src/contexts/weather/application/use-cases/export-weather-logs.ts';
import { GenerateWeatherInsights } from 'src/contexts/weather/application/use-cases/generate-weather-insights';
import { GetWeatherLogs } from 'src/contexts/weather/application/use-cases/get-weather-logs';
import { WeatherSseGateway } from 'src/contexts/weather/infra/http/weather/weather-sse.gateway';
import { WeatherController } from 'src/contexts/weather/infra/http/weather/weather.controller';
import { MongoWeatherLogRepository } from 'src/contexts/weather/infra/repositories/mongo/mongo-weather-log-repository';
import { WeatherMongoModule } from 'src/infra/database/mongodb/weather-mongo.module';
@Module({
  imports: [WeatherMongoModule],
  controllers: [WeatherController],
  providers: [
    WeatherSseGateway,
    CreateWeatherLogUseCase,
    GetWeatherLogs,
    ExportWeatherLogs,
    GenerateWeatherInsights,
    GeminiAIService,
    {
      provide: WeatherRepository,
      useClass: MongoWeatherLogRepository,
    },
  ],
})
export class WeatherModule {}
