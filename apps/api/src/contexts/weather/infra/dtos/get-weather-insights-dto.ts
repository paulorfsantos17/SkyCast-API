import { z } from 'zod';
import { LocationQuerySchema } from './location-query-dto';

export const GetWeatherInsightsQuerySchema = LocationQuerySchema.extend({
  locationId: z.string().uuid(),
  days: z.string().optional(),
});

export type GetWeatherInsightsQueryDTO = z.infer<typeof GetWeatherInsightsQuerySchema>;