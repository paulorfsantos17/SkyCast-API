// apps/api/src/modules/location/location.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import {
  LocationSchema,
  LocationSchemaClass
} from '../../infra/database/schemas/location-schema';
import {
  UserLocationSchema,
  UserLocationSchemaClass
} from '../../infra/database/schemas/user-location-schema';


import { GooglePlacesController } from '../../contexts/location/infra/http/google-places.controller';
import { UserLocationController } from '../../contexts/location/infra/http/user-location.controller';

import { CreateUserLocation } from 'src/contexts/location/application/use-cases/create-location';
import { GetUserLocations } from 'src/contexts/location/application/use-cases/get-user-locations';

import { GetPlaceDetailsGoogle } from 'src/contexts/location/application/use-cases/get-place-details-google';
import { SearchCitiesGoogle } from 'src/contexts/location/application/use-cases/search-cities-google';

import { GooglePlacesRepository } from 'src/contexts/location/application/repositories/google-places-repository';
import { LocationRepository } from 'src/contexts/location/application/repositories/location-repositories';
import { UserLocationRepository } from 'src/contexts/location/application/repositories/user-location-repositories';

import { GooglePlacesApiRepository } from '../../contexts/location/infra/repositories/google/google-places-api-repository';
import { MongooseLocationRepository } from '../../contexts/location/infra/repositories/mongo/mongoose-location-repository';
import { MongooseUserLocationRepository } from '../../contexts/location/infra/repositories/mongo/mongoose-user-location-repository';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LocationSchemaClass.name, schema: LocationSchema },
      { name: UserLocationSchemaClass.name, schema: UserLocationSchema },
    ]),
    RedisModule
  ],
  controllers: [
    UserLocationController,
    GooglePlacesController, 
  ],
  providers: [
    CreateUserLocation,
    GetUserLocations,

    SearchCitiesGoogle, 
    GetPlaceDetailsGoogle, 

    {
      provide: LocationRepository,
      useClass: MongooseLocationRepository,
    },
    {
      provide: UserLocationRepository,
      useClass: MongooseUserLocationRepository,
    },

    {
      provide: GooglePlacesRepository,
      useClass: GooglePlacesApiRepository, 
    },
  ],
  exports: [
    LocationRepository,
    UserLocationRepository,
    GooglePlacesRepository, 
  ],
})
export class LocationModule {}
