import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeatherLogsViewModel } from '@/services/viewmodels/useWeatherLogsViewModel'
import { Cloud, CloudRain, Sun } from 'lucide-react'

export const CurrentConditionCard = () => {
  const { latestLog, loading, error } = useWeatherLogsViewModel()

  // Função auxiliar para escolher o ícone baseado na condição
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'céu limpo':
      case 'ensolarado':
        return <Sun className="h-4 w-4 text-muted-foreground" />
      case 'nublado':
      case 'parcialmente nublado':
        return <Cloud className="h-4 w-4 text-muted-foreground" />
      case 'chuvoso':
      case 'chuva leve':
      case 'chuva forte':
        return <CloudRain className="h-4 w-4 text-muted-foreground" />
      default:
        return <Cloud className="h-4 w-4 text-muted-foreground" /> // Ícone padrão
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Condição Atual</CardTitle>
        {latestLog && getWeatherIcon(latestLog.condition)}
        {!latestLog && <Cloud className="h-4 w-4 text-muted-foreground" />} 
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-2xl font-bold">Carregando...</div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : latestLog ? (
          <>
            <div className="text-2xl font-bold">{latestLog.condition}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Probabilidade de Chuva: {latestLog.rainProbability}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Última atualização: {new Date(latestLog.timestamp).toLocaleTimeString()}
            </p>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Nenhum dado de condição disponível.</div>
        )}
      </CardContent>
    </Card>
  )
}
