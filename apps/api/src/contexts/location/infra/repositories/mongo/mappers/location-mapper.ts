// apps/api/src/contexts/location/infra/repositories/mongo/mappers/location-mapper.ts
import { LocationDocument } from '../../../../../../infra/database/schemas/location-schema';
import { Location } from '../../../../domain/entities/location';

export class LocationMapper {
  static toPersistence(location: Location): any {
    return {
      _id: location.id, 
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      googlePlaceId: location.googlePlaceId,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt,
    };
  }

  static toDomain(raw: LocationDocument): Location {
    return Location.create(
      {
        name: raw.name,
        latitude: raw.latitude,
        longitude: raw.longitude,
        googlePlaceId: raw.googlePlaceId,
      },
      raw._id.toString(), 
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
