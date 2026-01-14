import { formatTimestamp } from '@/lib/utils'
import { WeatherLog } from '@/models/WeatherLog'
import { weatherService } from '@/services/weather.service'
import { useCallback, useEffect, useState } from 'react'

export const useHistoricalWeatherLogsViewModel = () => {
  const [historicalLogs, setHistoricalLogs] = useState<WeatherLog[]>([])
  const [loadingHistoricalLogs, setLoadingHistoricalLogs] = useState(true)
  const [errorHistoricalLogs, setErrorHistoricalLogs] = useState<string | null>(null)

  const fetchHistoricalLogs = useCallback(async (
    startDate?: string,
    endDate?: string,
    limit: number = 100 // Limite padrão para o gráfico
  ) => {
    setLoadingHistoricalLogs(true)
    setErrorHistoricalLogs(null)
    try {
      const response = await weatherService.getLogs({
        startDate,
        endDate,
        limit,
      })
      const mappedLogs: WeatherLog[] = response.data.map(log => ({
        id: log.id,
        temperature: log.props.temperature,
        humidity: log.props.humidity,
        windSpeed: log.props.windSpeed,
        condition: log.props.condition,
        rainProbability: log.props.rainProbability,
        timestamp: formatTimestamp(log.props.timestamp),
      }));
      setHistoricalLogs(mappedLogs.reverse()) 
    } catch (err: any) {
      console.error('Erro ao buscar logs históricos:', err)
      setErrorHistoricalLogs(err.message || 'Falha ao carregar logs históricos.')
    } finally {
      setLoadingHistoricalLogs(false)
    }
  }, [])

  useEffect(() => {
    // Busca logs da última semana por padrão, ou um período relevante
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // Últimos 7 dias
    fetchHistoricalLogs(startDate, endDate);
  }, [fetchHistoricalLogs])

  return {
    historicalLogs,
    loadingHistoricalLogs,
    errorHistoricalLogs,
    fetchHistoricalLogs,
  }
}
