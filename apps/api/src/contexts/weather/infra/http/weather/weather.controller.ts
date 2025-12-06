import { Body, Controller, Get, Post, Query, UsePipes } from "@nestjs/common";
import { CreateWeatherLogUseCase } from "src/contexts/weather/application/use-cases/create-weather-log";
import { GetWeatherLogs } from "src/contexts/weather/application/use-cases/get-weather-logs";
import { ZodValidationPipe } from "src/core/pipes/zod-validation.pipe";
import { CreateWeatherLogSchema, type CreateWeatherLogDTO } from "../../dtos/create-weather-log-dto";
import { GetWeatherLogsQuerySchema, type GetWeatherLogsQueryDTO } from "../../dtos/get-weather-logs-dtos";

@Controller("weather")
export class WeatherController {
  constructor(
    private readonly getWeatherLogs: GetWeatherLogs, 
    private readonly createWeather: CreateWeatherLogUseCase
  ) {}

  @Post("/log")
  @UsePipes(new ZodValidationPipe(CreateWeatherLogSchema))
  async handle(@Body() body: CreateWeatherLogDTO) {
    return await this.createWeather.execute(body);
  }

  @Get("/logs")
  @UsePipes(new ZodValidationPipe(GetWeatherLogsQuerySchema))
  async getLogs(@Query() query: GetWeatherLogsQueryDTO) {
    return await this.getWeatherLogs.execute(query);
  }


}