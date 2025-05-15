import { Module } from '@nestjs/common';
import { RestApiController } from './rest_api.controller';
import { RestApiService } from './rest_api.service';

import { JwtStrategy } from './auth/jwt.strategy';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    UsersModule,
    ProjectsModule,
    KafkaModule,
  ],
  controllers: [RestApiController],
  providers: [RestApiService, JwtStrategy],
})
export class RestApiModule { }
