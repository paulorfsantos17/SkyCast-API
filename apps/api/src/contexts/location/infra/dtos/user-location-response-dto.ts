// apps/api/src/contexts/location/infra/dtos/user-location-response.dto.ts
import { z } from 'zod';

export const locationResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  googlePlaceId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userLocationResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  location: locationResponseSchema,
  createdAt: z.date(),
});

export const createUserLocationResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  location: locationResponseSchema,
  createdAt: z.date(),
  message: z.string(),
});

export type LocationResponseDto = z.infer<typeof locationResponseSchema>;
export type UserLocationResponseDto = z.infer<typeof userLocationResponseSchema>;
export type CreateUserLocationResponseDto = z.infer<typeof createUserLocationResponseSchema>;
