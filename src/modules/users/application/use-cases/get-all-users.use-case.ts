import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user.repository';
import { USER_REPOSITORY } from '../../domain/user.repository';
import type { User } from '../../domain/user.entity';

@Injectable()
export class GetAllUsersUseCase {

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}