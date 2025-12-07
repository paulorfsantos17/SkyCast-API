// src/services/weather.service.ts
import {
  ApiLogsResponse,
  ApiRawSingleInsightResponse, // Importe a interface para um único insight bruto
} from '@/models/WeatherLog'
import api from './api'

export const weatherService = {
  getLogs: async (params?: {
    page?: number
    limit?: number
    startDate?: string
    endDate?: string
  }): Promise<ApiLogsResponse> => {
    const response = await api.get('/weather/logs', { params })
    return response.data
  },

  exportCSV: async (): Promise<Blob> => {
    const response = await api.get('/weather/export.csv', {
      responseType: 'blob',
    })
    return response.data
  },

  exportXLSX: async (): Promise<Blob> => {
    const response = await api.get('/weather/export.xlsx', {
      responseType: 'blob',
    })
    return response.data
  },


  getInsights: async (): Promise<ApiRawSingleInsightResponse> => { 
    const response = await api.get('/weather/insights')
    return response.data
  },
}
