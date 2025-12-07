// src/models/WeatherLog.ts

export interface WeatherProps {
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  rainProbability: number
  timestamp: string
}

export interface ApiRawLogItem {
  id: string
  createdAt: string
  updatedAt: string
  props: WeatherProps
}

export interface WeatherLog {
  id: string
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  rainProbability: number
  timestamp: string
}

export interface ApiPagination {
  total: number
  limit: number
  skip: number
}

export interface ApiLogsResponse {
  data: ApiRawLogItem[]
  pagination: ApiPagination
}

export interface DetailedInsightProps {
  id: string
  summary: string
  trends: string[]
  recommendations: string[]
  period: {
    start: string
    end: string
  }
  dataPointsAnalyzed: number
  generatedAt: string
}

export interface ApiRawSingleInsightResponse {
  insight: DetailedInsightProps
}

export type ApiRawMultiInsightResponse = ApiRawSingleInsightResponse[];

export type WeatherInsight = DetailedInsightProps;
