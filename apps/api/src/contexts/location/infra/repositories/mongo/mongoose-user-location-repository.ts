import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLocationRepository } from 'src/contexts/location/application/repositories/user-location-repositories';
import {
  UserLocationDocument,
  UserLocationSchemaClass
} from '../../../../../infra/database/schemas/user-location-schema';
import { UserLocation } from '../../../domain/entities/user-location';
import { UserLocationMapper } from './mappers/user-location-mapper';

@Injectable()
export class MongooseUserLocationRepository implements UserLocationRepository {
  constructor(
    @InjectModel(UserLocationSchemaClass.name)
    private readonly userLocationModel: Model<UserLocationDocument>,
  ) {}

  async create(userLocation: UserLocation): Promise<UserLocation> {
    const data = UserLocationMapper.toPersistence(userLocation);

    const createdUserLocation = new this.userLocationModel(data);
    await createdUserLocation.save();

    return UserLocationMapper.toDomain(createdUserLocation);
  }

  async findByUserId(userId: string): Promise<UserLocation[]> {
    const userLocations = await this.userLocationModel
      .find({ userId })
      .sort({ createdAt: -1 }) // ✅ Ordena do mais recente para o mais antigo
      .exec();

    return userLocations.map(UserLocationMapper.toDomain);
  }

  async findByUserIdAndLocationId(
    userId: string, 
    locationId: string,
  ): Promise<UserLocation | null> {
    const userLocation = await this.userLocationModel
      .findOne({ userId, locationId })
      .exec();

    if (!userLocation) {
      return null;
    }

    return UserLocationMapper.toDomain(userLocation);
  }

  async delete(id: string): Promise<void> {
    await this.userLocationModel
      .deleteOne({ _id: id })
      .exec();
  }
}
