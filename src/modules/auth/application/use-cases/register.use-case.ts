import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users/domain/user.repository';
import type { IUserRepository } from '../../../users/domain/user.repository';
import type { RegisterDto } from '../../domain/register.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class RegisterUseCase {

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterDto): Promise<void> {
    // 1. Ya existe un usuario con ese email?
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    // 2. Hasheamos la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Guardamos el usuario nuevo
    await this.userRepository.save({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
    });
  }
}