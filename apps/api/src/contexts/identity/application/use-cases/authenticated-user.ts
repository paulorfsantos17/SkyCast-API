import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { HashService } from '../service/hash-service';

export interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export interface AuthenticateUserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

@Injectable()
export class AuthenticateUser {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
  ) {}

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
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

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
