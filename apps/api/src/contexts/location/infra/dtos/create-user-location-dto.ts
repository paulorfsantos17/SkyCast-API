// apps/api/src/contexts/location/infra/dtos/create-user-location.dto.ts
import { z } from 'zod';

export const createUserLocationSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome da cidade não pode estar vazio.')
    .max(255, 'O nome da cidade não pode ter mais de 255 caracteres.')
    .trim(),

  latitude: z
    .number()
    .min(-90, 'A latitude deve estar entre -90 e 90.')
    .max(90, 'A latitude deve estar entre -90 e 90.'),

  longitude: z
    .number()
    .min(-180, 'A longitude deve estar entre -180 e 180.')
    .max(180, 'A longitude deve estar entre -180 e 180.'),

  googlePlaceId: z
    .string()
    .min(1, 'O googlePlaceId é obrigatório.')
    .max(500, 'O googlePlaceId não pode ter mais de 500 caracteres.')
    .trim(),
});

// ✅ Tipo inferido corretamente
export type CreateUserLocationDto = z.infer<typeof createUserLocationSchema>;
