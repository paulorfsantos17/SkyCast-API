import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/contexts/identity/application/repositories/user-repository';
import { HashService } from 'src/contexts/identity/application/service/hash-service';
import { CreateUser } from 'src/contexts/identity/application/use-cases/create-user';
import { DeleteUser } from 'src/contexts/identity/application/use-cases/delete-user';
import { GetUserById } from 'src/contexts/identity/application/use-cases/get-user-by-id';
import { GetUsers } from 'src/contexts/identity/application/use-cases/get-users';
import { UpdateUser } from 'src/contexts/identity/application/use-cases/update-user';
import { UserController } from 'src/contexts/identity/infra/http/user-controller';
import { MongooseUserRepository } from 'src/contexts/identity/infra/repositories/mongo/mongoose-user-repository';
import { BcryptHashService } from 'src/contexts/identity/infra/services/bcrypt-hash-service';
import { IdentityMongoModule } from 'src/infra/database/mongodb/identity-mongo.module';

@Module({
  imports: [IdentityMongoModule, JwtModule.register({
    global: false,
  })],
  controllers: [UserController],
  providers: [
    CreateUser,
    UpdateUser,
    GetUserById,
    GetUsers,
    DeleteUser,
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
