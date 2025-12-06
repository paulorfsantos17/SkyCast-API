import { Module } from '@nestjs/common';
import { MongoModule } from './infra/database/mongo.module';
import { IdentityModule } from './modules/identity/identity.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [MongoModule, WeatherModule, IdentityModule],
})
export class AppModule {}
