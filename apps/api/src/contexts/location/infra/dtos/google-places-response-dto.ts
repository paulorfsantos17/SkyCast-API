import { z } from 'zod';


export const googlePlacePredictionResponseSchema = z.object({
  place_id: z.string(),
  description: z.string(),
  structured_formatting: z.object({
    main_text: z.string(),
    secondary_text: z.string().optional(),
  }),
});

export type GooglePlacePredictionResponseDto = z.infer<
  typeof googlePlacePredictionResponseSchema
>;


export const searchCitiesGoogleResponseSchema = z.object({
  status: z.string(),
  predictions: z.array(googlePlacePredictionResponseSchema),
});

export type SearchCitiesGoogleResponseDto = z.infer<
  typeof searchCitiesGoogleResponseSchema
>;



export const googlePlaceDetailsResponseSchema = z.object({
  place_id: z.string(),
  name: z.string(),
  geometry: z.object({
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
});

export type GooglePlaceDetailsResponseDto = z.infer<
  typeof googlePlaceDetailsResponseSchema
>;


export const getPlaceDetailsGoogleResponseSchema = z.object({
  status: z.string(),
  result: googlePlaceDetailsResponseSchema,
});

export type GetPlaceDetailsGoogleResponseDto = z.infer<
  typeof getPlaceDetailsGoogleResponseSchema
>;
