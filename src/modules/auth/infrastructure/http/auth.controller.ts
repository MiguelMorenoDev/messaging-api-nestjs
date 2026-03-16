import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import type { RegisterDto } from '../../domain/register.dto';
import type { LoginDto } from '../../domain/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {

  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: any) {
    return this.logoutUseCase.execute(req.user.id);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.refreshTokenUseCase.execute(body.refreshToken);
  }
}