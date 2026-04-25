import type {
  GetPlaceDetailsResponse,
  SearchCitiesResponse,
} from '../models/GooglePlaces';
import api from './api';

export const googlePlacesService = {

  async searchCities(input: string): Promise<SearchCitiesResponse> {
    const response = await api.get<SearchCitiesResponse>(
      '/google-places/autocomplete',
      {
        params: { input },
      }
    );
    return response.data;
  },

  async getPlaceDetails(placeId: string): Promise<GetPlaceDetailsResponse> {
    const response = await api.get<GetPlaceDetailsResponse>(
      '/google-places/details',
      {
        params: { place_id: placeId },
      }
    );
    return response.data;
  },
};
