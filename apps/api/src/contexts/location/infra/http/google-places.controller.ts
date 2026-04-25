import { Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from '../../../../core/pipes/zod-validation.pipe';
import { GetPlaceDetailsGoogle } from '../../application/use-cases/get-place-details-google';
import { SearchCitiesGoogle } from '../../application/use-cases/search-cities-google';
import {
  type GetPlaceDetailsGoogleQueryDto,
  getPlaceDetailsGoogleQuerySchema,
} from '../dtos/get-place-details-google-dto';
import {
  type GetPlaceDetailsGoogleResponseDto,
  SearchCitiesGoogleResponseDto,
} from '../dtos/google-places-response-dto';
import {
  type SearchCitiesGoogleQueryDto,
  searchCitiesGoogleQuerySchema,
} from '../dtos/search-cities-google-dto';
import { GooglePlaceDetailsMapper } from '../repositories/google/mappers/google-place-details-mapper';
import { GooglePlacePredictionMapper } from '../repositories/google/mappers/google-place-prediction-mapper';

@Controller('google-places')
export class GooglePlacesController {
  constructor(
    private readonly searchCitiesGoogle: SearchCitiesGoogle,
    private readonly getPlaceDetailsGoogle: GetPlaceDetailsGoogle,
  ) {}


  @Get('autocomplete')
  async autocomplete(
    @Query(new ZodValidationPipe(searchCitiesGoogleQuerySchema))
    query: SearchCitiesGoogleQueryDto,
  ): Promise<SearchCitiesGoogleResponseDto> {
    const result = await this.searchCitiesGoogle.execute({
      input: query.input,
    });

    return {
      status: 'OK',
      predictions: GooglePlacePredictionMapper.toDTOMany(result.predictions),
    };
  }

  @Get('details')
  async details(
    @Query(new ZodValidationPipe(getPlaceDetailsGoogleQuerySchema))
    query: GetPlaceDetailsGoogleQueryDto,
  ): Promise<GetPlaceDetailsGoogleResponseDto> {
    const result = await this.getPlaceDetailsGoogle.execute({
      placeId: query.place_id,
    });

    return {
      status: 'OK',
      result: GooglePlaceDetailsMapper.toDTO(result.details),
    };
  }
}
