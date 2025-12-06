import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

export interface WeatherDataForAnalysis {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  rainProbability: number;
  timestamp: string;
}

export interface AIInsightResponse {
  summary: string;
  trends: string[];
  recommendations: string[];
}

@Injectable()
export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não está definida nas variáveis de ambiente');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateWeatherInsights(weatherData: WeatherDataForAnalysis[]): Promise<AIInsightResponse> {
    const prompt = this.buildPrompt(weatherData);
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return this.parseResponse(text);
  }

  private buildPrompt(weatherData: WeatherDataForAnalysis[]): string {
    const dataCount = weatherData.length;
    const periodStart = weatherData[weatherData.length - 1]?.timestamp;
    const periodEnd = weatherData[0]?.timestamp;
    const dataString = weatherData.map(d => `${d.timestamp}: ${d.temperature}°C, ${d.humidity}% umidade, ${d.windSpeed}km/h vento, ${d.condition}, ${d.rainProbability}% chuva`).join('\n');
    return `Você é um especialista em análise meteorológica. Analise os seguintes dados climáticos históricos (${dataCount} registros de ${periodStart} até ${periodEnd}):\n\n${dataString}\n\nCom base nesses dados, forneça uma análise estruturada no seguinte formato JSON:\n\n{\n  "summary": "Um resumo geral do clima no período analisado (2-3 frases)",\n  "trends": ["Tendência 1 identificada", "Tendência 2 identificada", "Tendência 3 identificada"],\n  "recommendations": ["Recomendação prática 1", "Recomendação prática 2", "Recomendação prática 3"]\n}\n\nSeja objetivo, prático e baseie-se apenas nos dados fornecidos. Retorne APENAS o JSON, sem texto adicional.`;
    }

    private parseResponse(text: string): AIInsightResponse {
    try {
      let cleanText = text
        .replace(/json\s*/g, '') .replace(/```\s*/g, '') .trim();

  cleanText = cleanText.replace(/\n\s*\n/g, '\n');

  const parsed = JSON.parse(cleanText);

  if (!parsed.summary || !parsed.trends || !parsed.recommendations) {
    throw new Error('Resposta da IA não contém todas as propriedades necessárias');
  }

  return {
    summary: parsed.summary,
    trends: Array.isArray(parsed.trends) ? parsed.trends : ['Análise em processamento'],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ['Dados insuficientes'],
  };
  } catch (error) { console.error('Erro ao fazer parse da resposta da IA:', error); console.error('Texto recebido:', text);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || 'Análise não disponível',
        trends: parsed.trends || ['Análise em processamento'],
        recommendations: parsed.recommendations || ['Dados insuficientes'],
      };
    } catch {
      // Se falhar, retorna fallback
    }
  }

  return {
    summary: 'Erro ao processar análise da IA. Tente novamente.',
    trends: ['Análise em processamento'],
    recommendations: ['Dados insuficientes para recomendações específicas'],
  };
  } }
}