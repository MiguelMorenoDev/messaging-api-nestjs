import { Inject, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from '../../../users/domain/user.repository';
import type { IUserRepository } from '../../../users/domain/user.repository';
import type { LoginDomainDto } from '../../domain/login-domain.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {

  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDomainDto): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. ¿Existe el usuario?
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`Intento de login fallido - email no encontrado: ${dto.email}`)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // 2. ¿Está activo?
    if (!user.isEnabled()) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // 3. ¿La contraseña es correcta?
    const isMatch = await bcrypt.compare(dto.password, user.getPasswordHash());
    if (!isMatch) {
      this.logger.warn(`Intento de login fallido - contraseña incorrecta: ${dto.email}`)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // 4. Generamos los tokens
    const accessToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '15m' }
    );

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' }
    );

    // 5. Guardamos el refreshToken en la BD
    await this.userRepository.update(user.id, { refreshToken });

    this.logger.log(`Login exitoso: ${dto.email}`);

    return { accessToken, refreshToken };
  }
}