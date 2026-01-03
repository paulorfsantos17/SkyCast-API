// src/pages/dashboard/CurrentTemperaturedCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeatherLogsViewModel } from '@/viewmodels/useWeatherLogsViewModel'; // Caminho correto
import { Droplet, Thermometer, Wind } from 'lucide-react';

export const CurrentTemperatureCard = () => {
  const { latestLog, loading, error } = useWeatherLogsViewModel()
  console.log("🚀 ~ CurrentTemperatureCard ~ latestLog:", latestLog)

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Temperatura Atual</CardTitle>
        <Thermometer className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-2xl font-bold">Carregando...</div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : latestLog ? (
          <>
            <div className="text-2xl font-bold">{latestLog.temperature}°C</div>
            <p className="text-xs text-muted-foreground mt-1">
              Última atualização: {new Date(latestLog.timestamp.toString()).toLocaleTimeString()}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Droplet className="h-4 w-4 mr-1" />
                <span>{latestLog.humidity}% Umidade</span>
              </div>
              <div className="flex items-center">
                <Wind className="h-4 w-4 mr-1" />
                <span>{latestLog.windSpeed} km/h Vento</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Nenhum dado de temperatura disponível.</div>
        )}
      </CardContent>
    </Card>
  )
}
