// apps/api/src/infra/database/schemas/location-schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = LocationSchemaClass & Document;

@Schema({ 
  collection: 'locations', 
  timestamps: true 
})
export class LocationSchemaClass {
  @Prop({ required: true })
  _id: string; 

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  latitude: number;

  @Prop({ required: true, type: Number })
  longitude: number;

  @Prop({ 
    required: true, 
    unique: true, 
  })
  googlePlaceId: string;


  createdAt?: Date;
  updatedAt?: Date;
}

export const LocationSchema = SchemaFactory.createForClass(LocationSchemaClass);

LocationSchema.index({ googlePlaceId: 1 });
