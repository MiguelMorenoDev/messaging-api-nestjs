import { Inject, Injectable, UnauthorizedException  } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users/domain/user.repository';
import type { IUserRepository } from '../../../users/domain/user.repository';

@Injectable()
export class LogoutUseCase {

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: number): Promise<void> {
    // 1. ¿Existe el usuario?
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no identificado');
    }

    // 2. Borramos el refreshToken de la BD
    // Así aunque alguien tenga el refreshToken, ya no sirve
    await this.userRepository.update(userId, { refreshToken: null });
  }
}