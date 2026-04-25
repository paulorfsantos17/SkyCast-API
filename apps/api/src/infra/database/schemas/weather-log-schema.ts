import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherLogDocument = HydratedDocument<WeatherLog>;

@Schema({ timestamps: true })
export class WeatherLog {
  @Prop({ required: true }) temperature: number;
  @Prop({ required: true }) humidity: number;
  @Prop({ required: true }) windSpeed: number;
  @Prop({ required: true }) condition: string;
  @Prop({ required: true }) rainProbability: number;
  @Prop({ required: true }) timestamp: string;
  @Prop({ required: true }) locationId: string;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);