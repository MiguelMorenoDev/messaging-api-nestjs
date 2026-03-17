import { IsEmail, IsString, MinLength } from 'class-validator';
import { LoginDomainDto } from '@/modules/auth/domain/login-domain.dto'; 
export class LoginDto implements LoginDomainDto {
  @IsEmail({}, { message: 'Formato de email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe contener al menos 6 caracteres' })
  password: string;
}