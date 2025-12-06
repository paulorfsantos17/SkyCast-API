import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user';
import { UserRepository } from '../repositories/user-repository';
import { HashService } from '../service/hash-service';

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface CreateUserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
  };
}

@Injectable()
export class CreateUser {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const existingUser = await this.userRepository.findByEmail(request.email);

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const hashedPassword = await this.hashService.hash(request.password);

    const user = User.create({
      email: request.email,
      password: hashedPassword,
      name: request.name,
      role: request.role || 'user',
    });

    await this.userRepository.create(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}
