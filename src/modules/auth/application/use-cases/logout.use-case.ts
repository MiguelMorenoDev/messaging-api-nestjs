import { Inject, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users/domain/user.repository';
import type { IUserRepository } from '../../../users/domain/user.repository';
import { TokenBlacklistService } from '@/common/redis/token-blacklist.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LogoutUseCase {

    private readonly logger = new Logger(LogoutUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly tokenBlackListService: TokenBlacklistService,
    private readonly jwtService: JwtService
  ) {}

  async execute(userId: number, accessToken: string): Promise<void> {
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

    //Calcula el tiempo restante del accessToken
    const decoded = this.jwtService.decode(accessToken) as { exp: number };
    const expiresInSeconds = decoded.exp - Math.floor(Date.now() / 1000);

    //Añade a la blackList
    await this.tokenBlackListService.blacklist(accessToken, expiresInSeconds);
    // 2. Borramos el refreshToken de la BD
    // Así aunque alguien tenga el refreshToken, ya no sirve
    await this.userRepository.update(userId, { refreshToken: null });
        this.logger.log(`Logout exitoso: ${userId}`);

  }
}