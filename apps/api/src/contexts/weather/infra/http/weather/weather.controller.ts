import { Body, Controller, Get, Post, Query, Res, UsePipes } from "@nestjs/common";
import { type Response } from "express";
import { CreateWeatherLogUseCase } from "src/contexts/weather/application/use-cases/create-weather-log";
import { ExportWeatherLogs } from "src/contexts/weather/application/use-cases/export-weather-logs.ts";
import { GenerateWeatherInsights } from "src/contexts/weather/application/use-cases/generate-weather-insights";
import { GetWeatherLogs } from "src/contexts/weather/application/use-cases/get-weather-logs";
import { Public } from "src/core/decorators/public-decorators";
import { ZodValidationPipe } from "src/core/pipes/zod-validation.pipe";
import { CreateWeatherLogSchema, type CreateWeatherLogDTO } from "../../dtos/create-weather-log-dto";
import { GetWeatherLogsQuerySchema, type GetWeatherLogsQueryDTO } from "../../dtos/get-weather-logs-dtos";

@Controller("weather")
export class WeatherController {
  constructor(
    private readonly getWeatherLogs: GetWeatherLogs, 
    private readonly createWeather: CreateWeatherLogUseCase,
    private readonly exportWeatherLogs: ExportWeatherLogs,
    private readonly generateWeatherInsights: GenerateWeatherInsights
  ) {}

  @Post("/log")
  @Public()
  @UsePipes(new ZodValidationPipe(CreateWeatherLogSchema))
  async handle(@Body() body: CreateWeatherLogDTO) {
    return await this.createWeather.execute(body);
  }

  @Get("/logs")
  @UsePipes(new ZodValidationPipe(GetWeatherLogsQuerySchema))
  async getLogs(@Query() query: GetWeatherLogsQueryDTO) {
    return await this.getWeatherLogs.execute(query);
  }

  @Get("/export.csv")
  async exportCsv(@Res() res: Response) {
    const buffer = await this.exportWeatherLogs.execute('csv');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="weather-logs.csv"');
    res.send(buffer);
  }

  @Get("/export.xlsx")
  async exportXlsx(@Res() res: Response) {
    const buffer = await this.exportWeatherLogs.execute('xlsx');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="weather-logs.xlsx"');
    res.send(buffer);
  }

  
  @Get('/insights')
  async getInsights(@Query('days') days?: string) {
    const result = await this.generateWeatherInsights.execute({
      days: days ? parseInt(days) : 7,
    });

    return result;
  }

}