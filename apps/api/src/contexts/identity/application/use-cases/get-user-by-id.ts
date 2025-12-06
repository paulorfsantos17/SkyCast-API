import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';

export interface GetUserByIdRequest {
  id: string;
}

export interface GetUserByIdResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class GetUserById {
  constructor(private userRepository: UserRepository) {}

  async execute(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const user = await this.userRepository.findById(request.id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
