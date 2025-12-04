import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './infra/database/mongo.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [MongoModule, WeatherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
