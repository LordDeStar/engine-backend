import { Module } from '@nestjs/common';
import { RestApiController } from './rest_api.controller';
import { RestApiService } from './rest_api.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
            clientId: "rest-api"
          },
          consumer: {
            groupId: 'rest-api-group',
            allowAutoTopicCreation: true
          },
          producer: {
            allowAutoTopicCreation: true
          },
        }
      }
    ])],
  controllers: [RestApiController],
  providers: [RestApiService, JwtStrategy]
})
export class RestApiModule { }
