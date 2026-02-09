// apps/api/src/infra/database/schemas/user-location-schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserLocationDocument = UserLocationSchemaClass & Document;

@Schema({ 
  collection: 'user_locations', 
  timestamps: true 
})
export class UserLocationSchemaClass {
  @Prop({ required: true })
  _id: string; 

  @Prop({ 
    required: true, 
    index: true 
  })
  userId: string;

  @Prop({ 
    required: true, 
    index: true 
  })
  locationId: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserLocationSchema = SchemaFactory.createForClass(UserLocationSchemaClass);

UserLocationSchema.index({ userId: 1, locationId: 1 }, { unique: true });

UserLocationSchema.index({ userId: 1 });
