import { Injectable } from '@nestjs/common';
import { WeatherRepository } from 'src/contexts/weather/application/repositories/weather-repository';
import { GeminiAIService } from 'src/contexts/weather/application/services/gemini-ai.service';
import { WeatherInsight } from 'src/contexts/weather/domain/entities/weather-insight';

export interface GenerateWeatherInsightsRequest {
  days?: number;
}

export interface GenerateWeatherInsightsResponse {
  insight: {
    id: string;
    summary: string;
    trends: string[];
    recommendations: string[];
    period: {
      start: Date;
      end: Date;
    };
    dataPointsAnalyzed: number;
    generatedAt: Date;
  };
}

@Injectable()
export class GenerateWeatherInsights {
  constructor(
    private weatherRepository: WeatherRepository,
    private geminiAIService: GeminiAIService,
  ) {}

  async execute(request: GenerateWeatherInsightsRequest = {}): Promise<GenerateWeatherInsightsResponse> {
    const days = request.days || 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.weatherRepository.findAll({
      sort: { timestamp: -1 },
    });

    if (result.data.length === 0) {
      throw new Error('Não há dados suficientes para gerar insights');
    }

    const weatherData = result.data.map(log => ({
      temperature: log.temperature,
      humidity: log.humidity,
      windSpeed: log.windSpeed,
      condition: log.condition,
      rainProbability: log.rainProbability,
      timestamp: log.timestamp,
    }));

    const aiResponse = await this.geminiAIService.generateWeatherInsights(weatherData);

    const insight = WeatherInsight.create({
      summary: aiResponse.summary,
      trends: aiResponse.trends,
      recommendations: aiResponse.recommendations,
      periodStart: startDate,
      periodEnd: endDate,
      dataPointsAnalyzed: result.data.length,
      generatedAt: new Date(),
    });

    return {
      insight: {
        id: insight.id,
        summary: insight.summary,
        trends: insight.trends,
        recommendations: insight.recommendations,
        period: {
          start: insight.periodStart,
          end: insight.periodEnd,
        },
        dataPointsAnalyzed: insight.dataPointsAnalyzed,
        generatedAt: insight.generatedAt,
      },
    };
  }
}
