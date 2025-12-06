import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes
} from '@nestjs/common';

import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { CreateUser } from '../../application/use-cases/create-user';
import { createUserSchema, type CreateUserDto } from '../dtos/create-user-dto';

@Controller('users')
export class UserController {
  constructor(private createUser: CreateUser) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() body: CreateUserDto) {
    const result = await this.createUser.execute({
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role,
    });

    return result;
  }
}
