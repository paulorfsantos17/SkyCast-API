import { z } from 'zod';


export const searchCitiesGoogleQuerySchema = z.object({
  input: z
    .string()
    .min(3, 'O termo de busca deve ter pelo menos 3 caracteres')
    .max(255, 'O termo de busca é muito longo')
    .trim(),
});

export type SearchCitiesGoogleQueryDto = z.infer<typeof searchCitiesGoogleQuerySchema>;
