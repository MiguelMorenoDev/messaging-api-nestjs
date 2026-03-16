import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.entity';
import { UserOrmEntity } from './user.typeorm-entity';
import { UserMapper } from './user.mapper';
import { CreateUserDto } from '../../domain/create-user.dto';

@Injectable()
export class UserTypeormRepository implements IUserRepository {

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.repo.find();
    return users.map(UserMapper.toDomain);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOneBy({ email });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByIdAndRefreshToken(id: number, refreshToken: string): Promise<User | null> {
    const user = await this.repo.findOneBy({ id, refreshToken });
    return user ? UserMapper.toDomain(user) : null;
  }

  async save(data: CreateUserDto): Promise<User> {
    const ormEntity = UserMapper.toOrm(data);
    const saved = await this.repo.save(ormEntity);
    return UserMapper.toDomain(saved);
  }

  async update(id: number, data: { refreshToken?: string | null }): Promise<void> {
    await this.repo.update(id, data);
  }
}