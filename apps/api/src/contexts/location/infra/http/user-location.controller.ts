// apps/api/src/contexts/location/infra/http/user-location.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../core/decorators/current-user-decorator';
import { ZodValidationPipe } from '../../../../core/pipes/zod-validation.pipe';
import { User } from '../../../identity/domain/entities/user';
import { JwtAuthGuard } from '../../../identity/infra/auth/jwt-auth-guard';
import { CreateUserLocation } from '../../application/use-cases/create-location';
import { GetUserLocations } from '../../application/use-cases/get-user-locations';
import { createUserLocationSchema, type CreateUserLocationDto } from '../dtos/create-user-location-dto';


@Controller('user-locations')
@UseGuards(JwtAuthGuard) // ✅ Todas as rotas requerem autenticação
export class UserLocationController {
  constructor(
    private readonly createUserLocation: CreateUserLocation,
    private readonly getUserLocations: GetUserLocations,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createUserLocationSchema)) body: CreateUserLocationDto,
    @CurrentUser() user: User,
  ) {
    const { name, latitude, longitude, googlePlaceId } = body;

    const result = await this.createUserLocation.execute({
      userId: user.id,
      name,
      latitude,
      longitude,
      googlePlaceId,
    });

    return {
      id: result.userLocation.id,
      userId: result.userLocation.userId,
      location: {
        id: result.location.id,
        name: result.location.name,
        latitude: result.location.latitude,
        longitude: result.location.longitude,
        googlePlaceId: result.location.googlePlaceId,
        createdAt: result.location.createdAt,
        updatedAt: result.location.updatedAt,
      },
      createdAt: result.userLocation.createdAt,
      message: `Cidade "${result.location.name}" adicionada com sucesso!`,
    };
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUser() user: User) {
    const userLocationsWithDetails = await this.getUserLocations.execute({
      userId: user.id,
    });

    return userLocationsWithDetails.map((item) => ({
      id: item.id,
      userId: item.userId,
      location: {
        id: item.location.id,
        name: item.location.name,
        latitude: item.location.latitude,
        longitude: item.location.longitude,
        googlePlaceId: item.location.googlePlaceId,
        createdAt: item.location.createdAt,
        updatedAt: item.location.updatedAt,
      },
      createdAt: item.createdAt,
    }));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    // TODO: Implementar use case DeleteUserLocation
    // Por enquanto, vamos deixar preparado para o próximo passo
    throw new Error('Endpoint DELETE ainda não implementado');
  }
}
