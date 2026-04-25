import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Importe o Skeleton
import { formatTimeSaoPaulo } from '@/lib/utils';
import { WeatherLog } from '@/models/WeatherLog';
import { Droplet, Thermometer, Wind } from 'lucide-react';

interface CurrentTemperatureCardProps {
  latestLog: WeatherLog | null;
  loading: boolean;
  error: string | null;
}

export const CurrentTemperatureCard = ({ latestLog, loading, error }: CurrentTemperatureCardProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Temperatura Atual</CardTitle>
        {loading ? (
          <Skeleton className="h-4 w-4 rounded-full" />
        ) : (
          <Thermometer className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent  className='w-full h-full'>
        {loading ? (
          <div className="space-y-2 h-full w-full">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-[80%] mt-1" />
            <div className="flex items-center gap-4 mt-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : latestLog ? (
          <>
            <div className="text-2xl font-bold">{latestLog.temperature}°C</div>
            <p className="text-xs text-muted-foreground mt-1">
              Última atualização: {formatTimeSaoPaulo(latestLog.timestamp)}
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
  );
};