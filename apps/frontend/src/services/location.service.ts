import { z } from 'zod';
import { LocationSchema, UserLocation } from '../models/Location';
import api from './api';

export const CreateUserLocationPayloadSchema = z.object({
  name: z.string().min(1, 'O nome da cidade é obrigatório'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  googlePlaceId: z.string().min(1, 'O googlePlaceId é obrigatório'),
});

export type CreateUserLocationPayload = z.infer<typeof CreateUserLocationPayloadSchema>;

export const CreateUserLocationResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  location: LocationSchema,
  createdAt: z.string().datetime(),
  message: z.string(),
});

export type CreateUserLocationResponse = z.infer<typeof CreateUserLocationResponseSchema>;

export const locationService = {

  async getUserLocations(): Promise<UserLocation[]> {
    const response = await api.get<UserLocation[]>('/user-locations');
    return response.data;
  },


  async createUserLocation(payload: CreateUserLocationPayload): Promise<CreateUserLocationResponse> {
    const response = await api.post<CreateUserLocationResponse>('/user-locations', payload);
    return response.data;
  },

  async deleteUserLocation(id: string): Promise<void> {
    await api.delete(`/user-locations/${id}`);
  },

  async isLocationSaved(googlePlaceId: string): Promise<boolean> {
    try {
      const locations = await this.getUserLocations();
      return locations.some(
        (userLocation) => userLocation.location.googlePlaceId === googlePlaceId
      );
    } catch (error) {
      console.error('Erro ao verificar localização:', error);
      return false;
    }
  },

  async findLocationByPlaceId(googlePlaceId: string): Promise<UserLocation | null> {
    try {
      const locations = await this.getUserLocations();
      return (
        locations.find(
          (userLocation) => userLocation.location.googlePlaceId === googlePlaceId
        ) || null
      );
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
      return null;
    }
  },
};
