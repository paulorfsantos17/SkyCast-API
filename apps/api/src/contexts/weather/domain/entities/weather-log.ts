import { BaseEntity } from "src/core/entities/base-entity";

export interface WeatherLogProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  rainProbability: number;
  timestamp: string;
  locationId: string
}

export class WeatherLog extends BaseEntity<WeatherLogProps> {
  private constructor(props: WeatherLogProps, id?: string) {
    super(props, id);
  }

  get locationId() {
    return this.props.locationId;
  }
  

  get temperature() {
    return this.props.temperature;
  }

  get humidity() {
    return this.props.humidity;
  }

  get windSpeed() {
    return this.props.windSpeed;
  }

  get condition() {
    return this.props.condition;
  }

  get rainProbability() {
    return this.props.rainProbability;
  }

  get timestamp() {
    return this.props.timestamp;
  }

  // Exemplo de método de domínio
  isRainLikely() {
    return this.props.rainProbability > 50;
  }

  public static create(props: WeatherLogProps, id?: string): WeatherLog {
    return new WeatherLog(props, id);
  }



}