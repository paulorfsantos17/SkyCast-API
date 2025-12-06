import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { WeatherRepository } from '../repositories/weather-repository';

export type ExportFormat = 'csv' | 'xlsx';

@Injectable()
export class ExportWeatherLogs {
  constructor(private weatherRepository: WeatherRepository) {}

  async execute(format: ExportFormat = 'csv') {
    const result = await this.weatherRepository.findAll({
      sort: { timestamp: -1 },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Weather Logs');

    // Definir colunas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'Temperature', key: 'temperature', width: 15 },
      { header: 'Humidity', key: 'humidity', width: 15 },
      { header: 'Wind Speed', key: 'windSpeed', width: 15 },
      { header: 'Condition', key: 'condition', width: 25 },
      { header: 'Rain Probability', key: 'rainProbability', width: 20 },
      { header: 'Timestamp', key: 'timestamp', width: 25 },
    ];

    // Adicionar dados
    result.data.forEach(log => {
      worksheet.addRow({
        id: log.id,
        temperature: log.temperature,
        humidity: log.humidity,
        windSpeed: log.windSpeed,
        condition: log.condition,
        rainProbability: log.rainProbability,
        timestamp: log.timestamp.toString(),
      });
    });

    // Gerar arquivo
    if (format === 'csv') {
      return await workbook.csv.writeBuffer();
    } else {
      return await workbook.xlsx.writeBuffer();
    }
  }
}
