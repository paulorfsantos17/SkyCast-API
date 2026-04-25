export interface GooglePlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text?: string;
  };
}


export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}


export interface SearchCitiesResponse {
  status: string;
  predictions: GooglePlacePrediction[];
}


export interface GetPlaceDetailsResponse {
  status: string;
  result: GooglePlaceDetails;
}
