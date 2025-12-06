import { Module } from '@nestjs/common';
import { MongoModule } from './infra/database/mongo.module';
import { IdentityModule } from './infra/database/mongodb/identity-mongo.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [MongoModule, WeatherModule, IdentityModule],
})
export class AppModule {}
