import { BaseEntity } from '../../../../core/entities/base-entity';

export interface GooglePlaceDetailsProps {
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
}

export class GooglePlaceDetails extends BaseEntity<GooglePlaceDetailsProps> {
  private constructor(
    props: GooglePlaceDetailsProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(props, id, createdAt, updatedAt);
    this.validateCoordinates();
  }

  private validateCoordinates(): void {
    if (this.props.latitude < -90 || this.props.latitude > 90) {
      throw new Error('Latitude deve estar entre -90 e 90');
    }

    if (this.props.longitude < -180 || this.props.longitude > 180) {
      throw new Error('Longitude deve estar entre -180 e 180');
    }
  }

  get placeId(): string {
    return this.props.placeId;
  }

  get name(): string {
    return this.props.name;
  }

  get latitude(): number {
    return this.props.latitude;
  }

  get longitude(): number {
    return this.props.longitude;
  }

  static create(
    props: GooglePlaceDetailsProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ): GooglePlaceDetails {
    return new GooglePlaceDetails(props, id, createdAt, updatedAt);
  }

  static createFromGoogleApi(data: {
    place_id: string;
    name: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }): GooglePlaceDetails {
    return new GooglePlaceDetails({
      placeId: data.place_id,
      name: data.name,
      latitude: data.geometry.location.lat,
      longitude: data.geometry.location.lng,
    });
  }
}
