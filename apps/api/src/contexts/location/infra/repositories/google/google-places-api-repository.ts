import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { GooglePlacesRepository } from '../../../application/repositories/google-places-repository';
import { GooglePlaceDetails } from '../../../domain/entities/google-place-details';
import { GooglePlacePrediction } from '../../../domain/entities/google-place-prediction';
import { GooglePlaceDetailsMapper } from './mappers/google-place-details-mapper';
import { GooglePlacePredictionMapper } from './mappers/google-place-prediction-mapper';

@Injectable()
export class GooglePlacesApiRepository implements GooglePlacesRepository {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

    if (!this.apiKey) {
      console.error('⚠️ GOOGLE_MAPS_API_KEY não configurada no .env');
    }
  }


  async searchCities(input: string): Promise<GooglePlacePrediction[]> {
    if (!this.apiKey) {
      throw new BadRequestException('Google Maps API Key não configurada');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/autocomplete/json`, {
        params: {
          input,
          types: '(cities)',
          language: 'pt-BR',
          key: this.apiKey,
        },
      });

      if (
        response.data.status !== 'OK' &&
        response.data.status !== 'ZERO_RESULTS'
      ) {
        console.error('Erro na API do Google Places:', response.data.status);
        return [];
      }

      if (response.data.status === 'ZERO_RESULTS') {
        return [];
      }

      const predictions = response.data.predictions || [];
      return GooglePlacePredictionMapper.toDomainMany(predictions);
    } catch (error) {
      console.error('Erro ao buscar no Google Places:', error);
      throw new BadRequestException('Erro ao buscar cidades no Google Places');
    }
  }


  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    if (!this.apiKey) {
      throw new BadRequestException('Google Maps API Key não configurada');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/details/json`, {
        params: {
          place_id: placeId,
          fields: 'place_id,name,geometry',
          language: 'pt-BR',
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        console.error('Erro ao obter detalhes do lugar:', response.data.status);
        return null;
      }

      return GooglePlaceDetailsMapper.toDomain(response.data.result);
    } catch (error) {
      console.error('Erro ao obter detalhes do lugar:', error);
      throw new BadRequestException('Erro ao obter detalhes do lugar');
    }
  }
}
