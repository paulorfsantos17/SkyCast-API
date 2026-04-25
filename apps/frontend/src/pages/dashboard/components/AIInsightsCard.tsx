import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeatherInsightsViewModel } from '@/services/viewmodels/useWeatherInsightsViewModel';
import { Brain, Lightbulb, ThumbsUp, TrendingUp } from 'lucide-react';

export const AIInsightsCard = () => {
  const { insights, loadingInsights, errorInsights } = useWeatherInsightsViewModel();

  return (
    <Card className="col-span-full lg:col-span-2 h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Insights de IA</CardTitle>
        <Brain className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-full w-full flex flex-col">
        {loadingInsights ? (
          <div className="space-y-4 flex-1">

            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-1/2 mt-4" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-4 w-1/2 mt-4" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-3 w-1/4 mt-4" />
          </div>
        ) : errorInsights ? (
          <div className="text-sm text-destructive flex-1">{errorInsights}</div>
        ) : insights.length > 0 ? (
          <div className="space-y-6 flex-1">
            {insights.map((insight) => (
              <div key={insight.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Resumo do Período:
                </h3>
                <p className="text-base text-muted-foreground mb-3">{insight.summary}</p>

                <h4 className="text-md font-semibold flex items-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  Tendências:
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mb-3">
                  {insight.trends.map((trend, index) => (
                    <li key={index}>{trend}</li>
                  ))}
                </ul>

                <h4 className="text-md font-semibold flex items-center gap-1 mb-1">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  Recomendações:
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                  {insight.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>

                <p className="text-xs text-muted-foreground mt-3">
                  Gerado em: {new Date(insight.generatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground flex-1">Nenhum insight de IA disponível.</div>
        )}
      </CardContent>
    </Card>
  );
};