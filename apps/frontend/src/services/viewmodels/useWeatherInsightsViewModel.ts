import { useLocationContext } from '@/contexts/LocationContext';
import {
  ApiRawSingleInsightResponse,
  WeatherInsight,
} from '@/models/WeatherLog';
import { weatherService } from '@/services/weather.service';
import { useCallback, useEffect, useState } from 'react';

export const useWeatherInsightsViewModel = () => {
  const [insights, setInsights] = useState<WeatherInsight[]>([])
  const [loadingInsights, setLoadingInsights] = useState(true)
  const [errorInsights, setErrorInsights] = useState<string | null>(null)
  const { locationId } = useLocationContext()

  const fetchInsights = useCallback(async () => {
    if (!locationId) {
      setInsights([]);
      setErrorInsights('Localização não definida para buscar insights.');
      return;
    }

    setLoadingInsights(true);
    setErrorInsights(null);

    try {
      const apiResponse: ApiRawSingleInsightResponse = await weatherService.getInsights({
        locationId: locationId,
      });

      const mappedInsight: WeatherInsight = apiResponse.insight;
      setInsights([mappedInsight]);
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        setInsights([]);
        setErrorInsights('Não há dados suficientes para gerar uma análise.');
      } else {
        setErrorInsights(err.message || 'Falha ao carregar insights de IA.');
      }
    } finally {
      setLoadingInsights(false);
    }
  }, [locationId]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loadingInsights,
    errorInsights,
    fetchInsights,
  };
};