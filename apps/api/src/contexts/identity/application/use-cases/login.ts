import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { HashService } from '../service/hash-service';
import { TokenService } from '../service/token-service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

@Injectable()
export class Login {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
    private tokenService: TokenService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await this.hashService.compare(
      request.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(tokenPayload),
      this.tokenService.generateRefreshToken(tokenPayload),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
