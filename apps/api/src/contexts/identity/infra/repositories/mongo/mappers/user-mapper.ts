import { User } from "src/contexts/identity/domain/entities/user";


export class UserMapper {
  static toDomain(document: any): User {
    return User.create(
      {
        email: document.email,
        password: document.password,
        name: document.name,
        role: document.role,
      },
      document._id?.toString(),
      document.createdAt,
      document.updatedAt,
    );
  }

  static toPersistence(user: User) {
    return {
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
