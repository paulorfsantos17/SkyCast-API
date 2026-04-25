import { useLocationContext } from '@/contexts/LocationContext';
import { ApiLogsResponse, WeatherLog } from '@/models/WeatherLog';
import { weatherService } from '@/services/weather.service';
import { useCallback, useEffect, useState } from 'react';
import { useWeatherSse } from './useWeatherSse';

export const useWeatherLogsViewModel = () => {
  const [logs, setLogs] = useState<WeatherLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { locationId } = useLocationContext();

  const fetchLogs = useCallback(async () => {
    if (!locationId) return;

    setLoading(true);
    setError(null);

    try {
      const apiResponse: ApiLogsResponse = await weatherService.getLogs({ locationId });

      if (Array.isArray(apiResponse.data)) {
        const mappedLogs: WeatherLog[] = apiResponse.data.map((item) => ({
          id: item.id,
          temperature: item.props.temperature,
          humidity: item.props.humidity,
          windSpeed: item.props.windSpeed,
          condition: item.props.condition,
          rainProbability: item.props.rainProbability,
          timestamp: item.props.timestamp,
        }));

        setLogs(mappedLogs);
      } else {
        console.error("API retornou 'data' que não é um array:", apiResponse.data);
        setLogs([]);
        setError('Formato de dados inesperado da API.');
      }
    } catch (err: any) {
      console.error('Erro ao carregar logs:', err);
      setError(err.message || 'Falha ao carregar registros climáticos.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    if (locationId) {
      fetchLogs();
    }
  }, [fetchLogs]);

  useWeatherSse({
    onInitial: (initialLogs) => {

      setLogs(initialLogs);
    },
    onNewLog: (newLog) => {
      setLogs((prev) => [newLog, ...prev]);
    },
  });

  const latestLog: WeatherLog | null = logs.length > 0 ? logs[0] : null;

  return {
    logs,
    latestLog,
    loading,
    error,
    fetchLogs,
    exportCSV: weatherService.exportCSV,
    exportXLSX: weatherService.exportXLSX,
  };
};