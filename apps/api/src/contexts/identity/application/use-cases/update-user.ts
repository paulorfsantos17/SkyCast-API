import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { HashService } from '../service/hash-service';

export interface UpdateUserRequest {
  id: string;
  name?: string;
  password?: string;
  role?: string;
}

export interface UpdateUserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    updatedAt: Date;
  };
}

@Injectable()
export class UpdateUser {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
  ) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findById(request.id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (request.name) {
      user.updateName(request.name);
    }

    if (request.password) {
      const hashedPassword = await this.hashService.hash(request.password);
      user.updatePassword(hashedPassword);
    }

    if (request.role) {
      user.updateRole(request.role);
    }

    await this.userRepository.update(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        updatedAt: user.updatedAt,
      },
    };
  }
}
