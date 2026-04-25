import { GooglePlaceDetails } from '../../domain/entities/google-place-details';
import { GooglePlacePrediction } from '../../domain/entities/google-place-prediction';


export abstract class GooglePlacesRepository {
  
  abstract searchCities(input: string): Promise<GooglePlacePrediction[]>;
  abstract getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null>;
}
