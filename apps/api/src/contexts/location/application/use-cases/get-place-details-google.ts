// apps/api/src/contexts/location/application/use-cases/get-place-details-google.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GooglePlaceDetails } from '../../domain/entities/google-place-details';
import { GooglePlacesRepository } from '../repositories/google-places-repository';

interface GetPlaceDetailsGoogleRequest {
  placeId: string;
}

interface GetPlaceDetailsGoogleResponse {
  details: GooglePlaceDetails;
}

@Injectable()
export class GetPlaceDetailsGoogle {
  constructor(
    private readonly googlePlacesRepository: GooglePlacesRepository,
  ) {}

  async execute(
    request: GetPlaceDetailsGoogleRequest,
  ): Promise<GetPlaceDetailsGoogleResponse> {
    const { placeId } = request;

    if (!placeId || placeId.trim().length === 0) {
      throw new BadRequestException('O place_id é obrigatório');
    }

    const details = await this.googlePlacesRepository.getPlaceDetails(
      placeId.trim(),
    );

    if (!details) {
      throw new NotFoundException(
        `Lugar com place_id "${placeId}" não encontrado`,
      );
    }

    return {
      details,
    };
  }
}
