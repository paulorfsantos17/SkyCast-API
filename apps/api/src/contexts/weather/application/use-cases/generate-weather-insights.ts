import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { WeatherRepository } from 'src/contexts/weather/application/repositories/weather-repository'
import { GeminiAIService } from 'src/contexts/weather/application/services/gemini-ai.service'
import { WeatherInsight } from 'src/contexts/weather/domain/entities/weather-insight'
import { RedisService } from '../../../../modules/redis/redis.service'

export interface GenerateWeatherInsightsRequest {
  days?: number
  locationId: string
}

export interface GenerateWeatherInsightsResponse {
  insight: {
    id: string
    summary: string
    trends: string[]
    recommendations: string[]
    period: {
      start: Date
    }
    dataPointsAnalyzed: number
    generatedAt: Date
  }
  fromCache?: boolean
}

@Injectable()
export class GenerateWeatherInsights {
  constructor(
    private weatherRepository: WeatherRepository,
    private geminiAIService: GeminiAIService,
    private redisService: RedisService,
  ) {}

  async execute(
    request: GenerateWeatherInsightsRequest,
  ): Promise<GenerateWeatherInsightsResponse> {
    const days = request.days ?? 7
    const { locationId } = request

    const cacheKey = `weather:insights:${locationId}:${days}days`

    const cached =
      await this.redisService.getJson<GenerateWeatherInsightsResponse>(cacheKey)
    if (cached) {
      return { ...cached, fromCache: true }
    }

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const result = await this.weatherRepository.findAllByLocationId(
      locationId,
    )

    // CORREÇÃO: O throw deve estar DENTRO do if
    if (result.length === 0) {
      throw new UnprocessableEntityException(
        'Não há dados de clima suficientes para gerar insights para a localização e período especificados.',
      )
    }

    const weatherData = result.map((log) => ({
      temperature: log.temperature,
      humidity: log.humidity,
      windSpeed: log.windSpeed,
      condition: log.condition,
      rainProbability: log.rainProbability,
      timestamp: log.timestamp,
    }))

    const aiResponse =
      await this.geminiAIService.generateWeatherInsights(weatherData)

    const insight = WeatherInsight.create({
      summary: aiResponse.summary,
      trends: aiResponse.trends,
      recommendations: aiResponse.recommendations,
      periodStart: startDate,
      periodEnd: endDate,
      dataPointsAnalyzed: result.length,
      generatedAt: new Date(),
    })

    const response: GenerateWeatherInsightsResponse = {
      insight: {
        id: insight.id,
        summary: insight.summary,
        trends: insight.trends,
        recommendations: insight.recommendations,
        period: {
          start: insight.periodStart,
        },
        dataPointsAnalyzed: insight.dataPointsAnalyzed,
        generatedAt: insight.generatedAt,
      },
      fromCache: false,
    }

    await this.redisService.setJson(cacheKey, response, 3600)

    return response
  }
}