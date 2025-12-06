import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/contexts/identity/application/repositories/user-repository';
import { HashService } from 'src/contexts/identity/application/service/hash-service';
import { CreateUser } from 'src/contexts/identity/application/use-cases/create-user';
import { UpdateUser } from 'src/contexts/identity/application/use-cases/update-user';
import { UserController } from 'src/contexts/identity/infra/http/user-controller';
import { MongooseUserRepository } from 'src/contexts/identity/infra/repositories/mongo/mongoose-user-repository';
import { BcryptHashService } from 'src/contexts/identity/infra/services/bcrypt-hash-service';
import { UserDocument, UserSchema } from 'src/infra/database/schemas/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserDocument.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    CreateUser,
    UpdateUser,
    {
      provide: UserRepository,
      useClass: MongooseUserRepository,
    },
    {
      provide: HashService,
      useClass: BcryptHashService,
    },
  ],
  exports: [UserRepository, HashService],
})
export class IdentityModule {}
