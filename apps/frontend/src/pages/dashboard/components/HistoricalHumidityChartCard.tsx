// src/pages/dashboard/HistoricalHumidityChartCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useHistoricalWeatherLogsViewModel } from '@/viewmodels/useHistoricalWeatherLogsViewModel'
import { Droplet } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const HistoricalHumidityChartCard = () => {
  const { historicalLogs, loadingHistoricalLogs, errorHistoricalLogs } = useHistoricalWeatherLogsViewModel()

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Umidade Histórica</CardTitle>
        <Droplet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-[300px] w-full flex items-center justify-center">
        {loadingHistoricalLogs ? (
          <Skeleton className="h-[250px] w-full" />
        ) : errorHistoricalLogs ? (
          <div className="text-sm text-destructive">
            {errorHistoricalLogs}
          </div>
        ) : historicalLogs.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart
              data={historicalLogs}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
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
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: 'none' }}
                labelFormatter={(label) => new Date(label).toLocaleString()}
                formatter={(value: number) => [`${value}%`, 'Umidade']}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="hsl(var(--muted-foreground))" // Alterado para uma cor mais neutra
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-sm text-muted-foreground">
            Nenhum dado histórico de umidade disponível.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
