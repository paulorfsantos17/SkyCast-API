import { z } from 'zod';

export const GetWeatherLogsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(200).optional().default(100),
  skip: z.coerce.number().min(0).optional().default(0),
});

export type GetWeatherLogsQueryDTO = z.infer<typeof GetWeatherLogsQuerySchema>;