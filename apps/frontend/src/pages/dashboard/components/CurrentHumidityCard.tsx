import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeatherLogsViewModel } from '@/viewmodels/useWeatherLogsViewModel';
import { Droplet } from 'lucide-react'; // Ícone para umidade

export const CurrentHumidityCard = () => {
  const { latestLog, loading, error } = useWeatherLogsViewModel()

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Umidade Atual</CardTitle>
        <Droplet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-2xl font-bold">Carregando...</div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : latestLog ? (
          <>
            <div className="text-2xl font-bold">{latestLog.humidity}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Última atualização: {new Date(latestLog.timestamp).toLocaleTimeString()}
            </p>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Nenhum dado de umidade disponível.</div>
        )}
      </CardContent>
    </Card>
  )
}
