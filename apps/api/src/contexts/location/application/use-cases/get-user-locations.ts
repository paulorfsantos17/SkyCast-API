// apps/api/src/contexts/location/application/use-cases/get-user-locations.ts
import { Injectable } from '@nestjs/common';
import { Location } from '../../domain/entities/location';
import { LocationRepository } from '../repositories/location-repositories';
import { UserLocationRepository } from '../repositories/user-location-repositories';


interface GetUserLocationsRequest {
  userId: string;
}

interface UserLocationWithDetails {
  id: string; 
  userId: string;
  location: Location; 
  createdAt: Date;
}

@Injectable()
export class GetUserLocations {
  constructor(
    private readonly userLocationRepository: UserLocationRepository,
    private readonly locationRepository: LocationRepository,
  ) {}

  async execute({ userId }: GetUserLocationsRequest): Promise<UserLocationWithDetails[]> {
    const userLocations = await this.userLocationRepository.findByUserId(userId);

    const userLocationsWithDetails = await Promise.all(
      userLocations.map(async (userLocation) => {
        const location = await this.locationRepository.findById(userLocation.locationId);

        if (!location) {
          throw new Error(`Location com ID ${userLocation.locationId} não encontrada.`);
        }

        return {
          id: userLocation.id,
          userId: userLocation.userId,
          location,
          createdAt: userLocation.createdAt,
        };
      }),
    );

    return userLocationsWithDetails;
  }
}
