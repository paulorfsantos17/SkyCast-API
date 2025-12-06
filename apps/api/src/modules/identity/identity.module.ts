import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/contexts/identity/application/repositories/user-repository';
import { HashService } from 'src/contexts/identity/application/service/hash-service';
import { TokenService } from 'src/contexts/identity/application/service/token-service';
import { AuthenticateUser } from 'src/contexts/identity/application/use-cases/authenticated-user';
import { CreateUser } from 'src/contexts/identity/application/use-cases/create-user';
import { DeleteUser } from 'src/contexts/identity/application/use-cases/delete-user';
import { GetUserById } from 'src/contexts/identity/application/use-cases/get-user-by-id';
import { GetUsers } from 'src/contexts/identity/application/use-cases/get-users';
import { Login } from 'src/contexts/identity/application/use-cases/login';
import { RefreshToken } from 'src/contexts/identity/application/use-cases/refresh-token';
import { UpdateUser } from 'src/contexts/identity/application/use-cases/update-user';
import { JwtStrategy } from 'src/contexts/identity/infra/auth/jwt-strategy';
import { AuthController } from 'src/contexts/identity/infra/http/auth-service-controller';
import { UserController } from 'src/contexts/identity/infra/http/user-controller';
import { MongooseUserRepository } from 'src/contexts/identity/infra/repositories/mongo/mongoose-user-repository';
import { BcryptHashService } from 'src/contexts/identity/infra/services/bcrypt-hash-service';
import { JwtTokenService } from 'src/contexts/identity/infra/services/jwt-token-service';
import { IdentityMongoModule } from 'src/infra/database/mongodb/identity-mongo.module';

@Module({
  imports: [IdentityMongoModule, JwtModule.register({
    global: false,
  })],
  controllers: [UserController, AuthController],
  providers: [
    CreateUser,
    UpdateUser,
    GetUserById,
    GetUsers,
    DeleteUser,
    RefreshToken,
    AuthenticateUser,
    Login,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: MongooseUserRepository,
    },
    {
      provide: HashService,
      useClass: BcryptHashService,
    },
    {
      provide:TokenService,
      useClass: JwtTokenService
    }
  ],
  exports: [UserRepository, HashService, TokenService],
})
export class IdentityModule {}
