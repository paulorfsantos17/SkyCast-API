// apps/api/src/contexts/location/domain/entities/location.ts
import { BaseEntity } from '../../../../core/entities/base-entity';

export interface LocationProps {
  name: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string;
}

export class Location extends BaseEntity<LocationProps> {
  private constructor(props: LocationProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  // Getters para acessar as propriedades
  get name(): string {
    return this.props.name;
  }

  get latitude(): number {
    return this.props.latitude;
  }

  get longitude(): number {
    return this.props.longitude;
  }

  get googlePlaceId(): string {
    return this.props.googlePlaceId;
  }

  // Método estático para criar uma nova instância
  static create(props: LocationProps, id?: string, createdAt?: Date, updatedAt?: Date): Location {
    return new Location(props, id, createdAt, updatedAt);
  }

  // Método para atualizar informações da localização (se necessário no futuro)
  updateName(newName: string): void {
    this.updateProps({ name: newName });
  }
}
