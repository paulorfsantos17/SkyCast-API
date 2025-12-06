import { BaseEntity } from 'src/core/entities/base-entity';

export interface UserProps {
  email: string;
  password: string;
  name: string;
  role: string;
}

export class User extends BaseEntity<UserProps> {
  private constructor(props: UserProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get name() {
    return this.props.name;
  }

  get role() {
    return this.props.role;
  }

  isAdmin(): boolean {
    return this.props.role === 'admin';
  }

  updatePassword(newPassword: string): void {
    this.updateProps({ password: newPassword });
  }

  updateName(newName: string): void {
    this.updateProps({ name: newName });
  }

  updateRole(newRole: string): void {
    this.updateProps({ role: newRole });
  }

  public static create(props: UserProps, id?: string, createdAt?: Date, updatedAt?: Date): User {
    return new User(props, id, createdAt, updatedAt);
  }
}
