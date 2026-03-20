import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/modules/users/domain/user.repository';
import { TokenBlacklistService } from '@/common/redis/token-blacklist.service';


@Injectable()
export class JwtAuthGuard implements CanActivate {
private readonly logger = new Logger(JwtAuthGuard.name)

  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No autorizado');
    }

  //Comprueba si el token está en la blacklist
  const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(token);
  if (isBlacklisted) {
      this.logger.warn(`Intento de uso de accessToken revocado`);
      throw new UnauthorizedException('Token revocado');
    }


    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      //Comprobamos que el usuario tiene sesión activa en la BD
      const user = await this.userRepository.findById(decoded.id);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Sesión no válida');
      }

      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}