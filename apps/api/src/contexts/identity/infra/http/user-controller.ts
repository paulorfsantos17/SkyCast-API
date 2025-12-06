import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes
} from '@nestjs/common';

import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { CreateUser } from '../../application/use-cases/create-user';
import { GetUserById } from '../../application/use-cases/get-user-by-id';
import { GetUsers } from '../../application/use-cases/get-users';
import { UpdateUser } from '../../application/use-cases/update-user';
import { createUserSchema, type CreateUserDto } from '../dtos/create-user-dto';
import { updateUserSchema, type UpdateUserDto } from '../dtos/update-user-dto';

@Controller('users')
export class UserController {
  constructor(
    private updateUser: UpdateUser, 
    private createUser: CreateUser,
    private getUserById: GetUserById,
    private getUsers: GetUsers
  ) {}

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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string, 
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto
  ) {
    const result = await this.updateUser.execute({
      id,
      name: body.name,
      password: body.password,
      role: body.role,
    });

    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const result = await this.getUserById.execute({ id });
    return result;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await this.getUsers.execute();
    return result;
  }

}
