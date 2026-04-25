import { z } from 'zod';

export const LocationQuerySchema = z.object({
  locationId: z.string().min(1, 'locationId é obrigatório'),
});

export type LocationQueryDTO = z.infer<typeof LocationQuerySchema>;