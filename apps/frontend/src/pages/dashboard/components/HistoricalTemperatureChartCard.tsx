import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherLog } from '@/models/WeatherLog';
import { Thermometer } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface HistoricalTemperatureChartCardProps {
  historicalLogs: WeatherLog[];
  loadingHistoricalLogs: boolean;
  errorHistoricalLogs: string | null;
}

export const HistoricalTemperatureChartCard = ({
  historicalLogs,
  loadingHistoricalLogs,
  errorHistoricalLogs,
}: HistoricalTemperatureChartCardProps) => {
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Temperatura Histórica</CardTitle>
        {loadingHistoricalLogs ? (
          <Skeleton className="h-4 w-4 rounded-full" />
        ) : (
          <Thermometer className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="h-full w-full m-6">
        {loadingHistoricalLogs ? (
          <div className="relative h-full w-full p-4">
            <Skeleton className="absolute left-0 top-0 h-full w-4" />
            <Skeleton className="absolute bottom-0 left-0 h-4 w-full" />
            <Skeleton className="absolute top-0 left-6 h-[calc(100%-20px)] w-[calc(100%-30px)]" />
          </div>
        ) : errorHistoricalLogs ? (
          <div className="flex h-full items-center justify-center text-sm text-destructive">
            {errorHistoricalLogs}
          </div>
        ) : historicalLogs.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%"  >
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
                tickFormatter={(value) => `${value}°C`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: 'none' }}
                labelFormatter={(label) => new Date(label).toLocaleString()}
                formatter={(value: number) => [`${value}°C`, 'Temperatura']}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Nenhum dado histórico de temperatura disponível.
          </div>
        )}
      </CardContent>
    </Card>
  );
};