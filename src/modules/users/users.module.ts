import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/typeorm/user.typeorm-entity';
import { UserTypeormRepository } from './infrastructure/typeorm/user.typeorm-repository';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { UserController } from './infrastructure/http/user.controller';
import { USER_REPOSITORY } from './domain/user.repository';

@Module({
  imports: [
    // Le decimos a TypeORM qué entidad gestiona este módulo
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [UserController],
  providers: [
    // Aquí conectamos el Symbol con la implementación concreta
    // Cuando alguien pida USER_REPOSITORY, NestJS dará UserTypeormRepository
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeormRepository,
    },
    GetAllUsersUseCase,
    GetUserByIdUseCase,
  ],

  exports: [
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeormRepository,
    },
  ],
})
export class UsersModule {}