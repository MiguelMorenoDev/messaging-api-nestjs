import { CreateUserDto } from '../../domain/create-user.dto';
import { User } from '../../domain/user.entity';
import { UserOrmEntity } from './user.typeorm-entity';

export class UserMapper {

  // De base de datos al Dominio
  static toDomain(orm: UserOrmEntity): User {
    return new User(
      orm.id,
      orm.firstName,
      orm.lastName,
      orm.email,
      orm.password,
      orm.isActive,
      orm.refreshToken,
    );
  }

  //De dominio a base de datos

   static toOrm(data: CreateUserDto): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.firstName = data.firstName;
    orm.lastName = data.lastName;
    orm.email = data.email;
    orm.password = data.password;
    orm.isActive = data.isActive ?? true;
    orm.refreshToken = data.refreshToken ?? null;
    return orm;
  }

}