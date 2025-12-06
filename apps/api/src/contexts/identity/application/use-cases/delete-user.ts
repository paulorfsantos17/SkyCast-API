import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';

export interface DeleteUserRequest {
  id: string;
}

@Injectable()
export class DeleteUser {
  constructor(private userRepository: UserRepository) {}

  async execute(request: DeleteUserRequest): Promise<void> {
    const user = await this.userRepository.findById(request.id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await this.userRepository.delete(request.id);
  }
}
