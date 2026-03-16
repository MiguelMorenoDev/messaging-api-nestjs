import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';

@Controller('users')
export class UserController {

  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get()
  getAll() {
    return this.getAllUsersUseCase.execute();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.getUserByIdUseCase.execute(id);
  }
}