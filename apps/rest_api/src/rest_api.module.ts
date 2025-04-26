import { Module } from '@nestjs/common';
import { RestApiController } from './rest_api.controller';
import { RestApiService } from './rest_api.service';

@Module({
  controllers: [RestApiController],
})
export class RestApiModule { }
