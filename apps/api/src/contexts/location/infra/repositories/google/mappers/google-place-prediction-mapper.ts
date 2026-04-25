import { GooglePlacePrediction } from '../../../../domain/entities/google-place-prediction';


interface GooglePlacePredictionRaw {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text?: string;
  };
}


export class GooglePlacePredictionMapper {

  static toDomain(raw: GooglePlacePredictionRaw): GooglePlacePrediction {
    return GooglePlacePrediction.create({
      placeId: raw.place_id,
      description: raw.description,
      mainText: raw.structured_formatting.main_text,
      secondaryText: raw.structured_formatting.secondary_text,
    });
  }

  static toDomainMany(raw: GooglePlacePredictionRaw[]): GooglePlacePrediction[] {
    return raw.map((item) => this.toDomain(item));
  }

  static toDTO(entity: GooglePlacePrediction) {
    return {
      place_id: entity.placeId,
      description: entity.description,
      structured_formatting: {
        main_text: entity.mainText,
        secondary_text: entity.secondaryText,
      },
    };
  }


  static toDTOMany(entities: GooglePlacePrediction[]) {
    return entities.map((entity) => this.toDTO(entity));
  }
}
