import { ApiLogsResponse, WeatherLog } from '@/models/WeatherLog'; // Importe as interfaces ajustadas
import { weatherService } from '@/services/weather.service';
import { useCallback, useEffect, useState } from 'react';

export const useWeatherLogsViewModel = () => {
  const [logs, setLogs] = useState<WeatherLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(10) // Pode ser ajustado
  const [total, setTotal] = useState(0)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const apiResponse: ApiLogsResponse = await weatherService.getLogs({ page: 1, limit: 100 })

      if (Array.isArray(apiResponse.data)) {
        const mappedLogs: WeatherLog[] = apiResponse.data.map(item => ({
          id: item.id,
          temperature: item.props.temperature,
          humidity: item.props.humidity,
          windSpeed: item.props.windSpeed,
          condition: item.props.condition,
          rainProbability: item.props.rainProbability,
          timestamp: item.props.timestamp,
        }));

        setLogs(mappedLogs)
        setTotal(apiResponse.pagination.total)
      } else {
        console.error("API retornou 'data' que não é um array:", apiResponse.data);
        setLogs([]);
        setError("Formato de dados inesperado da API.");
      }
    } catch (err: any) {
      console.error('Erro ao carregar logs:', err)
      setError(err.message || 'Falha ao carregar registros climáticos.')
      setLogs([]);
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const latestLog = logs.length > 0
    ? logs.reduce((prev, current) => (new Date(prev.timestamp) > new Date(current.timestamp) ? prev : current))
    : null

  return {
    logs,
    latestLog, 
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    fetchLogs,
    exportCSV: weatherService.exportCSV,
    exportXLSX: weatherService.exportXLSX,
  }
}
