import { BaseEntity } from '../../../../core/entities/base-entity';

export interface UserLocationProps {
  userId: string;
  locationId: string;
}

export class UserLocation extends BaseEntity<UserLocationProps> {
  private constructor(props: UserLocationProps, id?: string, createdAt?: Date) {

    super(props, id, createdAt, createdAt);
  }

  get userId(): string {
    return this.props.userId;
  }

  get locationId(): string {
    return this.props.locationId;
  }

  static create(props: UserLocationProps, id?: string, createdAt?: Date): UserLocation {
    return new UserLocation(props, id, createdAt);
  }
}
