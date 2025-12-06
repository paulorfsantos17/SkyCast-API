import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { Login } from '../../application/use-cases/login';
import { RefreshToken } from '../../application/use-cases/refresh-token';
import { type LoginDto, loginSchema } from '../dtos/login-schema-dto';
import { type RefreshTokenDto, refreshTokenSchema } from '../dtos/refresh-token-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private login: Login,
    private refreshToken: RefreshToken,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async handleLogin(@Body(new ZodValidationPipe(loginSchema)) body: LoginDto) {
    const result = await this.login.execute({
      email: body.email,
      password: body.password,
    });

    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async handleRefresh(@Body(new ZodValidationPipe(refreshTokenSchema)) body: RefreshTokenDto) {
    const result = await this.refreshToken.execute({
      refreshToken: body.refreshToken,
    });

    return result;
  }
}
