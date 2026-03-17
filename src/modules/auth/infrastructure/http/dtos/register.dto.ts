import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import type { RegisterDomainDto } from '../../../domain/register-domain.dto';

export class RegisterDto implements RegisterDomainDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail({}, { message: 'Formato de email inválido' })
  email: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'La contraseña debe incluir mayúscula, minúscula, número y símbolo',
  })
  password: string;
}