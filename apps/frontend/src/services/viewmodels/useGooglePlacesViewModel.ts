// apps/frontend/src/services/viewmodels/useGooglePlacesViewModel.ts
import { useCallback, useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import type {
  GooglePlaceDetails,
  GooglePlacePrediction,
} from '../../models/GooglePlaces';
import { googlePlacesService } from '../google-places.service';

export function useGooglePlacesViewModel() {
  const { toast } = useToast();

  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [placeDetails, setPlaceDetails] = useState<GooglePlaceDetails | null>(
    null
  );
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const searchCities = useCallback(
    async (input: string) => {
      if (input.length < 3) {
        setPredictions([]);
        return;
      }

      setIsSearching(true);

      try {
        const response = await googlePlacesService.searchCities(input);
        setPredictions(response.predictions);
      } catch (error: any) {
        console.error('Erro ao buscar cidades:', error);

        toast({
          title: 'Erro ao buscar cidades',
          description:
            error.response?.data?.message ||
            'Não foi possível buscar as cidades. Tente novamente.',
          variant: 'destructive',
        });

        setPredictions([]);
      } finally {
        setIsSearching(false);
      }
    },
    [toast]
  );

  
  const getPlaceDetails = useCallback(
    async (placeId: string) => {
      setIsLoadingDetails(true);

      try {
        const response = await googlePlacesService.getPlaceDetails(placeId);
        setPlaceDetails(response.result);
        return response.result;
      } catch (error: any) {
        console.error('Erro ao obter detalhes do lugar:', error);

        toast({
          title: 'Erro ao obter detalhes',
          description:
            error.response?.data?.message ||
            'Não foi possível obter os detalhes do lugar. Tente novamente.',
          variant: 'destructive',
        });

        setPlaceDetails(null);
        return null;
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [toast]
  );

 
  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  const clearPlaceDetails = useCallback(() => {
    setPlaceDetails(null);
  }, []);

  return {
    predictions,
    isSearching,
    placeDetails,
    isLoadingDetails,

    searchCities,
    getPlaceDetails,
    clearPredictions,
    clearPlaceDetails,
  };
}
