import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';

export interface GetUsersResponse {
  users: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

@Injectable()
export class GetUsers {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<GetUsersResponse> {
    const users = await this.userRepository.findAll();

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    };
  }
}
