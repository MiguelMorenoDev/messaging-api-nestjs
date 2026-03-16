import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from '../../../users/domain/user.repository';
import type { IUserRepository } from '../../../users/domain/user.repository';

@Injectable()
export class RefreshTokenUseCase {

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Verificamos que el refreshToken es válido
    let decoded: { id: number };
    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    // 2. Buscamos el usuario y comprobamos que el token coincide con el de la BD
    const user = await this.userRepository.findByIdAndRefreshToken(decoded.id, refreshToken);
    if (!user) {
      throw new UnauthorizedException('Sesión no válida');
    }

    // 3. Generamos nuevos tokens (rotation)
    const newAccessToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '15m' }
    );

    const newRefreshToken = this.jwtService.sign(
      { id: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' }
    );

    // 4. Guardamos el nuevo refreshToken, invalidando el viejo
    await this.userRepository.update(user.id, { refreshToken: newRefreshToken });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}