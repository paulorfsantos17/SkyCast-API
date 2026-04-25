import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherLog } from '@/models/WeatherLog';
import { Wind } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface HistoricalWindSpeedChartCardProps {
  historicalLogs: WeatherLog[];
  loadingHistoricalLogs: boolean;
  errorHistoricalLogs: string | null;
}

export const HistoricalWindSpeedChartCard = ({
  historicalLogs,
  loadingHistoricalLogs,
  errorHistoricalLogs,
}: HistoricalWindSpeedChartCardProps) => {
  const formatXAxis = (tickItem: string) => {
    return new Date(tickItem).toLocaleTimeString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTooltipLabel = (label: string) => {
    return new Date(label).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Velocidade do Vento Histórica</CardTitle>
        {loadingHistoricalLogs ? (
          <Skeleton className="h-4 w-4 rounded-full" />
        ) : (
          <Wind className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="h-[300px] w-full flex items-center justify-center">
        {loadingHistoricalLogs ? (
          <div className="relative h-full w-full p-4">
            <Skeleton className="absolute left-0 top-0 h-full w-4" />
            <Skeleton className="absolute bottom-0 left-0 h-4 w-full" />
            <Skeleton className="absolute top-0 left-6 h-[calc(100%-20px)] w-[calc(100%-30px)]" />
          </div>
        ) : errorHistoricalLogs ? (
          <div className="text-sm text-destructive">{errorHistoricalLogs}</div>
        ) : historicalLogs.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={historicalLogs} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} km/h`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: 'none' }}
                labelFormatter={formatTooltipLabel}
                formatter={(value: number) => [`${value} km/h`, 'Velocidade do Vento']}
              />
              <Line
                type="monotone"
                dataKey="windSpeed"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-sm text-muted-foreground">
            Nenhum dado histórico de velocidade do vento disponível.
          </div>
        )}
      </CardContent>
    </Card>
  );
};