import { Inject, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users/domain/user.repository';
import type { IUserRepository } from '../../../users/domain/user.repository';

@Injectable()
export class LogoutUseCase {

    private readonly logger = new Logger(LogoutUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: number): Promise<void> {
    // 1. ¿Existe el usuario?
    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.warn(`Intento Logout con usuario inexistente ${userId}`)
      throw new UnauthorizedException('Usuario no identificado');
    }

    //Detectar doble logout
    if (!user.refreshToken) {
  this.logger.warn(`Intento de doble logout detectado - userId: ${userId}`);
  throw new UnauthorizedException('No hay sesión activa');
    }
    // 2. Borramos el refreshToken de la BD
    // Así aunque alguien tenga el refreshToken, ya no sirve
    await this.userRepository.update(userId, { refreshToken: null });
        this.logger.log(`Logout exitoso: ${userId}`);

  }
}