import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { TokenService } from '../service/token-service';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshToken {
  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository,
  ) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const payload = await this.tokenService.verifyRefreshToken(request.refreshToken);

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new Error('Usuário não encontrado');
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
    };
  }
}
