import { ConflictException, Injectable } from '@nestjs/common';

import { Location } from '../../domain/entities/location';
import { UserLocation } from '../../domain/entities/user-location';
import { LocationRepository } from '../repositories/location-repositories';
import { UserLocationRepository } from '../repositories/user-location-repositories';

interface CreateUserLocationRequest {
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string;
}

interface CreateUserLocationResponse {
  userLocation: UserLocation;
  location: Location;
}

@Injectable()
export class CreateUserLocation {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly userLocationRepository: UserLocationRepository,
  ) {}

  async execute({
    userId,
    name,
    latitude,
    longitude,
    googlePlaceId,
  }: CreateUserLocationRequest): Promise<CreateUserLocationResponse> {

    // 1️⃣ Verificar se a Location já existe no banco
    let location = await this.locationRepository.findByGooglePlaceId(googlePlaceId);

    // 2️⃣ Se não existe, criar a Location
    if (!location) {
      location = Location.create({
        name,
        latitude,
        longitude,
        googlePlaceId,
      });
      location = await this.locationRepository.create(location);
    }

    const existingUserLocation = await this.userLocationRepository.findByUserIdAndLocationId(
      userId,
      location.id,
    );

    if (existingUserLocation) {
      throw new ConflictException(
        `A cidade "${location.name}" já está nas suas localizações salvas.`,
      );
    }

    const userLocation = UserLocation.create({
      userId,
      locationId: location.id,
    });

    const createdUserLocation = await this.userLocationRepository.create(userLocation);

    return {
      userLocation: createdUserLocation,
      location,
    };
  }
}
