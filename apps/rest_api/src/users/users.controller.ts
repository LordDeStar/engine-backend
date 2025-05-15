import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('123')
  public async test() {
    return { test: "test" };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  public testRoute() {
    return { message: "It's works" }
  }

  @Post('auth')
  public async auth(@Body() userData: CreateUserDto) {
    return await this.usersService.login(userData);
  }

  @Post('create-user')
  public async create(@Body() userData: CreateUserDto): Promise<any> {
    return await this.usersService.createUser(userData);
  }
}
