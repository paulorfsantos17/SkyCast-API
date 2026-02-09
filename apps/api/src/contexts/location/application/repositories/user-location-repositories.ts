import { UserLocation } from '../../domain/entities/user-location';

export abstract class UserLocationRepository {
  abstract create(userLocation: UserLocation): Promise<UserLocation>;
  abstract findByUserId(userId: string): Promise<UserLocation[]>;
  abstract findByUserIdAndLocationId(userId: string, locationId: string): Promise<UserLocation | null>;
  abstract delete(id: string): Promise<void>;
}
