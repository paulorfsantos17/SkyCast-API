import { useLocationContext } from '@/contexts/LocationContext'
import { WeatherLog } from '@/models/WeatherLog'
import { weatherService } from '@/services/weather.service'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useWeatherSse } from './useWeatherSse'

export const useHistoricalWeatherLogsViewModel = () => {
  const [historicalLogs, setHistoricalLogs] = useState<WeatherLog[]>([])
  const [loadingHistoricalLogs, setLoadingHistoricalLogs] = useState(true)
  const [errorHistoricalLogs, setErrorHistoricalLogs] = useState<string | null>(null)
  const { locationId } = useLocationContext()

  const currentRangeRef = useRef<{ startDate?: string; endDate?: string }>({})

  const fetchHistoricalLogs = useCallback(
    async (startDate?: string, endDate?: string, limit: number = 100) => {
      if (!locationId) return

      currentRangeRef.current = { startDate, endDate }

      setLoadingHistoricalLogs(true)
      setErrorHistoricalLogs(null)

      try {
        const response = await weatherService.getLogs({
          locationId,
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
          timestamp: log.props.timestamp,
        }))

        setHistoricalLogs(mappedLogs.reverse())
      } catch (err: any) {
        console.error('Erro ao buscar logs históricos:', err)
        setErrorHistoricalLogs(err.message || 'Falha ao carregar logs históricos.')
      } finally {
        setLoadingHistoricalLogs(false)
      }
    },
    [locationId]
  )

  // Quando locationId mudar, zera estado e busca de novo
  useEffect(() => {
    if (!locationId) {
      setHistoricalLogs([])
      setLoadingHistoricalLogs(false)
      setErrorHistoricalLogs(null)
      return
    }

    const endDate = new Date().toISOString()
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    setHistoricalLogs([])          // evita dados da cidade antiga
    setLoadingHistoricalLogs(true) // mostra loading na troca
    fetchHistoricalLogs(startDate, endDate)
  }, [ fetchHistoricalLogs])

useWeatherSse({
  onNewLog: (newLog) => {

    const { startDate } = currentRangeRef.current // ⬅️ só startDate
    const logTime = new Date(newLog.timestamp).getTime()
    const afterStart = startDate ? logTime >= new Date(startDate).getTime() : true

    if (afterStart) { // ⬅️ remove o beforeEnd
      setHistoricalLogs(prev => [...prev, newLog])
    }
  },
})

  return {
    historicalLogs,
    loadingHistoricalLogs,
    errorHistoricalLogs,
    fetchHistoricalLogs,
  }
}