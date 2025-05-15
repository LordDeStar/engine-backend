import { Controller, Get, Inject, Body, Post, OnModuleInit, UseGuards } from '@nestjs/common';
import { RestApiService } from './rest_api.service';
import { CreateUserDto } from './dto/user/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class RestApiController {
  constructor(private readonly apiService: RestApiService) { }
}
