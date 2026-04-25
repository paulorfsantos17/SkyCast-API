// src/services/weather.service.ts
import {
  ApiLogsResponse,
  ApiRawSingleInsightResponse,
} from '@/models/WeatherLog';
import api from './api';


export const weatherService = {
  getLogs: async (params: {
    locationId: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<ApiLogsResponse> => {
    const response = await api.get('/weather/logs', { params })
    return response.data
  },
  exportCSV: async (locationId: string | undefined): Promise<Blob> => {
    const response = await api.get('/weather/export.csv', {
      params: { locationId },
      responseType: 'blob',
    })
    return response.data
  },

  exportXLSX: async (locationId: string): Promise<Blob> => {
    const response = await api.get('/weather/export.xlsx', {
      params: { locationId },
      responseType: 'blob',
    })
    return response.data
  },

  getInsights: async (params: {
    locationId: string,
  }): Promise<ApiRawSingleInsightResponse> => {

    
    const response = await api.get('/weather/insights', { params })
    return response.data
  },
}