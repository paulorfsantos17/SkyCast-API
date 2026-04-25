import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LocationRepository } from 'src/contexts/location/application/repositories/location-repositories';
import { RedisService } from 'src/modules/redis/redis.service';
import {
  LocationDocument,
  LocationSchemaClass,
} from '../../../../../infra/database/schemas/location-schema';
import { Location } from '../../../domain/entities/location';
import { LocationMapper } from './mappers/location-mapper';

const CACHE_KEY = 'active_locations';

@Injectable()
export class MongooseLocationRepository implements LocationRepository {
  private readonly logger = new Logger(MongooseLocationRepository.name);

  constructor(
    @InjectModel(LocationSchemaClass.name)
    private readonly locationModel: Model<LocationDocument>,

    private readonly redisService: RedisService,
  ) {}

  async create(location: Location): Promise<Location> {
    const data = LocationMapper.toPersistence(location);

    const createdLocation = new this.locationModel(data);
    await createdLocation.save();

    const domainLocation = LocationMapper.toDomain(createdLocation);

    await this.syncCache();

    return domainLocation;
  }

  async findByGooglePlaceId(googlePlaceId: string): Promise<Location | null> {
    const location = await this.locationModel
      .findOne({ googlePlaceId })
      .exec();

    if (!location) return null;

    return LocationMapper.toDomain(location);
  }

  async findById(id: string): Promise<Location | null> {
    const location = await this.locationModel
      .findOne({ _id: id })
      .exec();

    if (!location) return null;

    return LocationMapper.toDomain(location);
  }

  private async syncCache(): Promise<void> {
    try {
      const locations = await this.locationModel
        .find()
        .select('latitude longitude name _id')
        .lean()
        .exec();

      const payload = locations.map((loc) => ({
        latitude: loc['latitude'],
        longitude: loc['longitude'],
        name: loc['name'] ?? `${loc['latitude']},${loc['longitude']}`,
        id: loc['_id'],
      }));

      await this.redisService.setJson(CACHE_KEY, payload);

      this.logger.log(
        `Cache sincronizado com ${payload.length} localização(ões).`,
      );
    } catch (error: any) {
      this.logger.error(
        `Erro ao sincronizar cache do Redis: ${error.message}`,
      );
    }
  }
}