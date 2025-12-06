import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from '../schemas/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserDocument.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class IdentityMongoModule {}