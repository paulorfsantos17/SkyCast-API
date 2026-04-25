import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import type { GooglePlaceDetails } from '../../models/GooglePlaces';
import { UserLocation } from '../../models/Location';
import { CreateUserLocationPayload, locationService, } from '../location.service';

export function useUserLocationsViewModel() {
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const data = await locationService.getUserLocations();

      setLocations(data);
    } catch (error: any) {
      console.error('Erro ao carregar localizações:', error);
      toast({
        title: 'Erro ao carregar cidades',
        description: error.response?.data?.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createLocation = async (payload: CreateUserLocationPayload) => {
    try {
      setIsCreating(true);
      const newLocation = await locationService.createUserLocation(payload);

      setLocations((prev) => [
        {
          id: newLocation.id,
          userId: newLocation.userId,
          location: newLocation.location,
          createdAt: newLocation.createdAt,
        },
        ...prev,
      ]);

      toast({
        title: 'Cidade adicionada!',
        description: newLocation.message,
      });

      return newLocation;
    } catch (error: any) {
      console.error('Erro ao adicionar localização:', error);

      const errorMessage = error.response?.data?.message || 'Ocorreu um erro inesperado.';

      toast({
        title: 'Erro ao adicionar cidade',
        description: errorMessage,
        variant: 'destructive',
      });

      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteLocation = async (id: string, cityName: string) => {
    try {
      setIsDeleting(id);
      await locationService.deleteUserLocation(id);

      // Remove da lista local
      setLocations((prev) => prev.filter((loc) => loc.id !== id));

      toast({
        title: 'Cidade removida',
        description: `"${cityName}" foi removida das suas localizações.`,
      });
    } catch (error: any) {
      console.error('Erro ao remover localização:', error);
      toast({
        title: 'Erro ao remover cidade',
        description: error.response?.data?.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsDeleting(null);
    }
  };

  const reloadLocations = async () => {
    await loadLocations();
  };




  const findLocationByPlaceId = useCallback(
    (googlePlaceId: string): UserLocation | null => {
      return (
        locations.find(
          (userLocation) => userLocation.location.googlePlaceId === googlePlaceId
        ) || null
      );
    },
    [locations]
  );

  const saveLocation = useCallback(
    async (placeDetails: GooglePlaceDetails) => {
      const isLocationSaved = findLocationByPlaceId(placeDetails.place_id);

      if (isLocationSaved) {
        const location = isLocationSaved
        return location
      }

      const payload: CreateUserLocationPayload = {
        name: placeDetails.name,
        latitude: placeDetails.geometry.location.lat,
        longitude: placeDetails.geometry.location.lng,
        googlePlaceId: placeDetails.place_id,
      };

      return await createLocation(payload);
    },
    [ createLocation, toast]
  );

  useEffect(() => {
    loadLocations();
  }, []);

  return {
    // Estados
    locations,
    isLoading,
    isCreating,
    isDeleting,

    createLocation,
    deleteLocation,
    reloadLocations,

    findLocationByPlaceId,
    saveLocation,
  };
}
