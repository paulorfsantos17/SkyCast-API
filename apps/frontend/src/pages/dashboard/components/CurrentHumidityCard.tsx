// src/pages/dashboard/CurrentHumidityCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Importe o Skeleton
import { formatTimeSaoPaulo } from '@/lib/utils';
import { WeatherLog } from '@/models/WeatherLog';
import { Droplet } from 'lucide-react';

interface CurrentHumidityCardProps {
  latestLog: WeatherLog | null;
  loading: boolean;
  error: string | null;
}

export const CurrentHumidityCard = ({ latestLog, loading, error }: CurrentHumidityCardProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Umidade Atual</CardTitle>
        {loading ? (
          <Skeleton className="h-4 w-4 rounded-full" />
        ) : (
          <Droplet className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className='w-full h-full'>
        {loading ? (
          <div className="space-y-2 w-full h-full">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-[80%] mt-1" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : latestLog ? (
          <>
            <div className="text-2xl font-bold">{latestLog.humidity}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Última atualização: {formatTimeSaoPaulo(latestLog.timestamp)}
            </p>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Nenhum dado de umidade disponível.</div>
        )}
      </CardContent>
    </Card>
  );
};