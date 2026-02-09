import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationRepository } from 'src/contexts/location/application/repositories/location-repositories';
import {
  LocationDocument,
  LocationSchemaClass
} from '../../../../../infra/database/schemas/location-schema';
import { Location } from '../../../domain/entities/location';
import { LocationMapper } from './mappers/location-mapper';

@Injectable()
export class MongooseLocationRepository implements LocationRepository {
  constructor(
    @InjectModel(LocationSchemaClass.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async create(location: Location): Promise<Location> {
    const data = LocationMapper.toPersistence(location);

    const createdLocation = new this.locationModel(data);
    await createdLocation.save();

    return LocationMapper.toDomain(createdLocation);
  }

  async findByGooglePlaceId(googlePlaceId: string): Promise<Location | null> {
    const location = await this.locationModel
      .findOne({ googlePlaceId })
      .exec();

    if (!location) {
      return null;
    }

    return LocationMapper.toDomain(location);
  }

  async findById(id: string): Promise<Location | null> {
    const location = await this.locationModel
      .findOne({ _id: id })
      .exec();

    if (!location) {
      return null;
    }

    return LocationMapper.toDomain(location);
  }
}
