import { BaseEntity } from '../../../../core/entities/base-entity';

export interface GooglePlacePredictionProps {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText?: string;
}

export class GooglePlacePrediction extends BaseEntity<GooglePlacePredictionProps> {
  private constructor(
    props: GooglePlacePredictionProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(props, id, createdAt, updatedAt);
  }

  // Getters para acessar as propriedades
  get placeId(): string {
    return this.props.placeId;
  }

  get description(): string {
    return this.props.description;
  }

  get mainText(): string {
    return this.props.mainText;
  }

  get secondaryText(): string | undefined {
    return this.props.secondaryText;
  }

  // Método estático para criar uma nova instância
  static create(
    props: GooglePlacePredictionProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ): GooglePlacePrediction {
    return new GooglePlacePrediction(props, id, createdAt, updatedAt);
  }

  // Método estático para criar a partir da resposta da API do Google
  static createFromGoogleApi(data: {
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text?: string;
    };
  }): GooglePlacePrediction {
    return new GooglePlacePrediction({
      placeId: data.place_id,
      description: data.description,
      mainText: data.structured_formatting.main_text,
      secondaryText: data.structured_formatting.secondary_text,
    });
  }
}
