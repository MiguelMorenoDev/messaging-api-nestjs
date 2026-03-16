import { User } from './user.entity'
import { DataSource } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
    //Traer todos los usuarios
    findAll(): Promise<User[]>

    //Traer usuario por id
    findById(id: number): Promise<User | null >;

    //buscar email (para el login)
    findByEmail(email: string): Promise<User | null>;

    //para traer un usuario que tenga id y el refreshToken
    //Para validar que el token no fue revocado
    findByIdAndRefreshToken(id: number, refreshToken: string): Promise<User | null>;

    //Guarda un usuario o actualiza uno existente
    save(data: CreateUserDto) : Promise<User>;

    //Actualiza campos concretos de un usuario
    update(id: number, data: {refreshToken?: string | null}):Promise<void>;
    
}