import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, TokenService } from '../../application/service/token-service';

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly accessSecret: Buffer;
  private readonly refreshSecret: Buffer;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(private jwtService: JwtService) {
    this.accessSecret = Buffer.from(process.env.JWT_ACCESS_SECRET || 'access-secret');
    this.refreshSecret = Buffer.from(process.env.JWT_REFRESH_SECRET || 'refresh-secret');
    this.accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      },
      {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn,
      } as any,
    );
  }

  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      } as any,
    );
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.accessSecret,
      } as any);
      return decoded;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.refreshSecret,
      } as any);
      return decoded;
    } catch (error) {
      throw new Error('Refresh token inválido ou expirado');
    }
  }
}
