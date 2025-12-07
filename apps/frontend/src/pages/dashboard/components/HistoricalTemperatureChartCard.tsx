// src/pages/dashboard/HistoricalTemperatureChartCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useHistoricalWeatherLogsViewModel } from '@/viewmodels/useHistoricalWeatherLogsViewModel'
import { Thermometer } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const HistoricalTemperatureChartCard = () => {
  const { historicalLogs, loadingHistoricalLogs, errorHistoricalLogs } = useHistoricalWeatherLogsViewModel()

  // Formata o timestamp para exibição no eixo X
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Ex: 14:30
  };

  return (
    <Card className="col-span-full lg:col-span-2"> {/* Ocupa mais espaço */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Temperatura Histórica</CardTitle>
        <Thermometer className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-[300px] w-full"> {/* Altura fixa para o gráfico */}
        {loadingHistoricalLogs ? (
          <div className="flex h-full items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : errorHistoricalLogs ? (
          <div className="flex h-full items-center justify-center text-sm text-destructive">
            {errorHistoricalLogs}
          </div>
        ) : historicalLogs.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
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
  )
}
