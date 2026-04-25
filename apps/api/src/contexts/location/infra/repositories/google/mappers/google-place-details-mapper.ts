import { GooglePlaceDetails } from '../../../../domain/entities/google-place-details';


interface GooglePlaceDetailsRaw {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}


export class GooglePlaceDetailsMapper {

  static toDomain(raw: GooglePlaceDetailsRaw): GooglePlaceDetails {
    return GooglePlaceDetails.create({
      placeId: raw.place_id,
      name: raw.name,
      latitude: raw.geometry.location.lat,
      longitude: raw.geometry.location.lng,
    });
  }


  static toDTO(entity: GooglePlaceDetails) {
    return {
      place_id: entity.placeId,
      name: entity.name,
      geometry: {
        location: {
          lat: entity.latitude,
          lng: entity.longitude,
        },
      },
    };
  }
}
