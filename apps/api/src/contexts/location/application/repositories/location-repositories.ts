import { Location } from '../../domain/entities/location';

export abstract class LocationRepository {
  abstract create(location: Location): Promise<Location>;
  abstract findByGooglePlaceId(googlePlaceId: string): Promise<Location | null>;
  abstract findById(id: string): Promise<Location | null>;
}
