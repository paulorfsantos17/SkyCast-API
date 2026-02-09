import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './contexts/identity/infra/auth/jwt-auth-guard';
import { MongoModule } from './infra/database/mongo.module';
import { IdentityModule } from './modules/identity/identity.module';
import { LocationModule } from './modules/location/location.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    MongoModule,
    WeatherModule,
    IdentityModule,
    LocationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
