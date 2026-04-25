import { z } from 'zod';

export const LocationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  googlePlaceId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Location = z.infer<typeof LocationSchema>;

export const UserLocationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  location: LocationSchema,
  createdAt: z.string().datetime(),
});

export type UserLocation = z.infer<typeof UserLocationSchema>;
