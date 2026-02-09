import { UserLocationDocument } from '../../../../../../infra/database/schemas/user-location-schema';
import { UserLocation } from '../../../../domain/entities/user-location';

export class UserLocationMapper {
  static toPersistence(userLocation: UserLocation): any {
    return {
      _id: userLocation.id, 
      userId: userLocation.userId,
      locationId: userLocation.locationId,
      createdAt: userLocation.createdAt,
      updatedAt: userLocation.updatedAt,
    };
  }

  static toDomain(raw: UserLocationDocument): UserLocation {
    return UserLocation.create(
      {
        userId: raw.userId,
        locationId: raw.locationId,
      },
      raw._id.toString(), 
      raw.createdAt,
    );
  }
}
