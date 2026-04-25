import { z } from 'zod';

export const GetWeatherLogsQuerySchema = z.object({
  locationId: z.string().uuid(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.string().min(1).max(100).optional(),
});

export type GetWeatherLogsQueryDTO = z.infer<typeof GetWeatherLogsQuerySchema>;