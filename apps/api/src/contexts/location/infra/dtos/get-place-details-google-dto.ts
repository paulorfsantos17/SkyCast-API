import { z } from 'zod';


export const getPlaceDetailsGoogleQuerySchema = z.object({
  place_id: z
    .string()
    .min(1, 'O place_id não pode estar vazio')
    .trim(),
});

export type GetPlaceDetailsGoogleQueryDto = z.infer<typeof getPlaceDetailsGoogleQuerySchema>;

