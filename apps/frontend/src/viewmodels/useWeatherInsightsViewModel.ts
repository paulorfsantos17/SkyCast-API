// src/viewmodels/useWeatherInsightsViewModel.ts
import {
  ApiRawSingleInsightResponse,
  WeatherInsight,
} from '@/models/WeatherLog'
import { weatherService } from '@/services/weather.service'
import { useCallback, useEffect, useState } from 'react'

export const useWeatherInsightsViewModel = () => {
  const [insights, setInsights] = useState<WeatherInsight[]>([]) 
  const [loadingInsights, setLoadingInsights] = useState(true)
  const [errorInsights, setErrorInsights] = useState<string | null>(null)

  const fetchInsights = useCallback(async () => {
    setLoadingInsights(true)
    setErrorInsights(null)
    try {
      const apiResponse: ApiRawSingleInsightResponse = await weatherService.getInsights()

      const mappedInsight: WeatherInsight = apiResponse.insight;
      setInsights([mappedInsight])
    } catch (err: any) {
      console.error('Erro ao buscar insights de IA:', err)
      setErrorInsights(err.message || 'Falha ao carregar insights de IA.')
    } finally {
      setLoadingInsights(false)
    }
  }, [])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  return {
    insights,
    loadingInsights,
    errorInsights,
    fetchInsights,
  }
}
