import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { CreateWeatherLogUseCase } from "src/contexts/weather/application/use-cases/create-weather-log";
import { ZodValidationPipe } from "src/core/pipes/zod-validation.pipe";
import { type CreateWeatherLogDTO, CreateWeatherLogSchema } from "../../dtos/create-weather-log-dto";

@Controller("weather")
export class WeatherController {
  constructor(private readonly createWeather: CreateWeatherLogUseCase) {}

  @Post("/log")
  @UsePipes(new ZodValidationPipe(CreateWeatherLogSchema))
  async handle(@Body() body: CreateWeatherLogDTO) {
    return await this.createWeather.execute(body);
  }
}