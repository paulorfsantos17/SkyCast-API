import { useLocationContext } from '@/contexts/LocationContext'
import { WeatherLog } from '@/models/WeatherLog'
import { useEffect, useRef } from 'react'

interface UseWeatherSseOptions {
  onInitial?: (logs: WeatherLog[]) => void
  onNewLog?: (log: WeatherLog) => void
}

export const useWeatherSse = (options: UseWeatherSseOptions) => { // ⬅️ remove o | any
  const { locationId } = useLocationContext()

  const onInitialRef = useRef<UseWeatherSseOptions['onInitial']>(options?.onInitial)
  const onNewLogRef = useRef<UseWeatherSseOptions['onNewLog']>(options?.onNewLog)
  onInitialRef.current = options?.onInitial
  onNewLogRef.current = options?.onNewLog

  useEffect(() => {
    if (!locationId) return

    const url = `${import.meta.env.VITE_API_URL}/weather/events?locationId=${locationId}`

    const eventSource = new EventSource(url)

    eventSource.addEventListener('initial', (event) => {
      try {
        const rawArray = JSON.parse((event as MessageEvent).data)
        const logs: WeatherLog[] = rawArray.map((raw: any) => ({
          id: raw.id,
          temperature: raw.props?.temperature ?? raw.temperature,
          humidity: raw.props?.humidity ?? raw.humidity,
          windSpeed: raw.props?.windSpeed ?? raw.windSpeed,
          condition: raw.props?.condition ?? raw.condition,
          rainProbability: raw.props?.rainProbability ?? raw.rainProbability,
          timestamp: raw.props?.timestamp ?? raw.timestamp,
        }))
        onInitialRef.current?.(logs)
      } catch (e) {
        console.error('Erro ao processar SSE initial:', e)
      }
    })

    eventSource.addEventListener('update', (event) => {

      try {
        const raw = JSON.parse((event as MessageEvent).data)
        const newLog: WeatherLog = {
          id: raw.id,
          temperature: raw.temperature,
          humidity: raw.humidity,
          windSpeed: raw.windSpeed,
          condition: raw.condition,
          rainProbability: raw.rainProbability,
          timestamp: raw.timestamp,
        }
        onNewLogRef.current?.(newLog)
      } catch (e) {
        console.error('Erro ao processar SSE update:', e)
      }
    })

    eventSource.onerror = (err) => {
      console.error('SSE erro:', err)
    }

    return () => {
      eventSource.close()
    }
  }, [locationId])
}