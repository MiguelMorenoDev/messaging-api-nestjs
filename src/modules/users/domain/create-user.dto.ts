export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
  refreshToken?: string | null;
}