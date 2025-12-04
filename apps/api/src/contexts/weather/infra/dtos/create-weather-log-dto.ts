import z from "zod";

export const CreateWeatherLogSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  condition: z.string(),
  rainProbability: z.number(),
  timestamp: z.string().datetime(),
});

export type CreateWeatherLogDTO = z.infer<typeof CreateWeatherLogSchema>;