import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/infra/database/schemas/user-schema';
import { UserRepository } from '../../../application/repositories/user-repository';
import { User } from '../../../domain/entities/user';
import { UserMapper } from './mappers/user-mapper';

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    return UserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return UserMapper.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().sort({ createdAt: -1 }).exec();
    return users.map(UserMapper.toDomain);
  }

  async update(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.userModel.findByIdAndUpdate(user.id, data).exec();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
