import { Controller, Get, Inject, Body, Post, OnModuleInit, UseGuards } from '@nestjs/common';
import { RestApiService } from './rest_api.service';
import { CreateUserDto } from './dto/user/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class RestApiController {
  constructor(private readonly apiService: RestApiService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  public testRoute() {
    return { message: "It's works" }
  }

  @Post('auth')
  public async auth(@Body() userData: CreateUserDto) {
    return await this.apiService.login(userData);
  }

  @Post('create-user')
  public async create(@Body() userData: CreateUserDto): Promise<any> {
    return await this.apiService.createUser(userData);
  }

}
