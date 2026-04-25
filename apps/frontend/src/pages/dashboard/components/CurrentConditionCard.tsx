// src/pages/dashboard/CurrentConditionCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimeSaoPaulo } from '@/lib/utils';
import { WeatherLog } from '@/models/WeatherLog';
import { Cloud, CloudRain, Sun } from 'lucide-react';

interface CurrentConditionCardProps {
  latestLog: WeatherLog | null;
  loading: boolean;
  error: string | null;
}

export const CurrentConditionCard = ({ latestLog, loading, error }: CurrentConditionCardProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'céu limpo':
      case 'ensolarado':
        return <Sun className="h-4 w-4 text-muted-foreground" />;
      case 'nublado':
      case 'parcialmente nublado':
        return <Cloud className="h-4 w-4 text-muted-foreground" />;
      case 'chuvoso':
      case 'chuva leve':
      case 'chuva forte':
        return <CloudRain className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Cloud className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Condição Atual</CardTitle>
        {loading ? (
          <Skeleton className="h-4 w-4 rounded-full" />
        ) : latestLog ? (
          getWeatherIcon(latestLog.condition)
        ) : (
          <Cloud className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className='w-full h-full'>
        {loading ? (
          <div className="space-y-2 w-full">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-[80%] mt-1" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : latestLog ? (
          <>
            <div className="text-2xl font-bold">{latestLog.condition}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Probabilidade de Chuva: {latestLog.rainProbability}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Última atualização: {formatTimeSaoPaulo(latestLog.timestamp)}
            </p>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Nenhum dado de condição disponível.</div>
        )}
      </CardContent>
    </Card>
  );
};