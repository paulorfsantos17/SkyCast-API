// apps/api/src/contexts/location/application/use-cases/search-cities-google.ts
import { BadRequestException, Injectable } from '@nestjs/common';

import { GooglePlacePrediction } from '../../domain/entities/google-place-prediction';
import { GooglePlacesRepository } from '../repositories/google-places-repository';

interface SearchCitiesGoogleRequest {
  input: string;
}

interface SearchCitiesGoogleResponse {
  predictions: GooglePlacePrediction[];
}

@Injectable()
export class SearchCitiesGoogle {
  constructor(
    private readonly googlePlacesRepository: GooglePlacesRepository,
  ) {}

  async execute(
    request: SearchCitiesGoogleRequest,
  ): Promise<SearchCitiesGoogleResponse> {
    const { input } = request;

    if (!input || input.trim().length < 3) {
      throw new BadRequestException(
        'O termo de busca deve ter pelo menos 3 caracteres',
      );
    }

    // Busca as cidades no repositório
    const predictions = await this.googlePlacesRepository.searchCities(
      input.trim(),
    );

    return {
      predictions,
    };
  }
}
