import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  LocationSchema,
  LocationSchemaClass
} from '../../infra/database/schemas/location-schema';
import {
  UserLocationSchema,
  UserLocationSchemaClass
} from '../../infra/database/schemas/user-location-schema';

import { UserLocationController } from '../../contexts/location/infra/http/user-location.controller';



import { LocationRepository } from 'src/contexts/location/application/repositories/location-repositories';
import { UserLocationRepository } from 'src/contexts/location/application/repositories/user-location-repositories';
import { CreateUserLocation } from 'src/contexts/location/application/use-cases/create-location';
import { GetUserLocations } from 'src/contexts/location/application/use-cases/get-user-locations';
import { MongooseLocationRepository } from '../../contexts/location/infra/repositories/mongo/mongoose-location-repository';
import { MongooseUserLocationRepository } from '../../contexts/location/infra/repositories/mongo/mongoose-user-location-repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LocationSchemaClass.name, schema: LocationSchema },
      { name: UserLocationSchemaClass.name, schema: UserLocationSchema },
    ]),
  ],
  controllers: [
    UserLocationController,
  ],
  providers: [
    CreateUserLocation,
    GetUserLocations,
    CreateUserLocation,

    {
      provide: LocationRepository,
      useClass: MongooseLocationRepository,
    },
    {
      provide: UserLocationRepository,
      useClass: MongooseUserLocationRepository,
    },
  ],
  exports: [
    LocationRepository,
    UserLocationRepository,
  ],
})
export class LocationModule {}
