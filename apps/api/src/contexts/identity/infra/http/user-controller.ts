import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes
} from '@nestjs/common';

import { CurrentUser, type CurrentUserPayload } from 'src/core/decorators/current-user-decorator';
import { Public } from 'src/core/decorators/public-decorators';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { CreateUser } from '../../application/use-cases/create-user';
import { DeleteUser } from '../../application/use-cases/delete-user';
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
    private getUsers: GetUsers,
    private deleteUser: DeleteUser
  ) {}
  @Public()
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

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto
  ) {
    const result = await this.updateUser.execute({
      id: user.userId,
      name: body.name,
      password: body.password,
      role: body.role,
    });

    return result;
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async findOne(@CurrentUser() user: CurrentUserPayload) {
    const result = await this.getUserById.execute({ id : user.userId});
    return result;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await this.getUsers.execute();
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteUser.execute({ id });
  }



}
