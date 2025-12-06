import { BaseEntity } from "src/core/entities/base-entity";

export interface WeatherInsightProps {
  summary: string;
  trends: string[];
  recommendations: string[];
  periodStart: Date;
  periodEnd: Date;
  dataPointsAnalyzed: number;
  generatedAt: Date;
}

export class WeatherInsight extends BaseEntity<WeatherInsightProps> {
  private constructor(props: WeatherInsightProps, id?: string) {
    super(props, id);
  }

  get summary() {
    return this.props.summary;
  }

  get trends() {
    return this.props.trends;
  }

  get recommendations() {
    return this.props.recommendations;
  }

  get periodStart() {
    return this.props.periodStart;
  }

  get periodEnd() {
    return this.props.periodEnd;
  }

  get dataPointsAnalyzed() {
    return this.props.dataPointsAnalyzed;
  }

  get generatedAt() {
    return this.props.generatedAt;
  }

  isOutdated(hoursThreshold: number = 24): boolean {
    const now = new Date();
    const hoursSinceGenerated = (now.getTime() - this.props.generatedAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceGenerated > hoursThreshold;
  }

  public static create(props: WeatherInsightProps, id?: string): WeatherInsight {
    return new WeatherInsight(props, id);
  }
}
