import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: "userms",
          brokers: ['kafka:9092']
        },
        consumer: {
          allowAutoTopicCreation: true,
          groupId: 'user-service-group',
        },
      }
    });
  await app.listen();
}


bootstrap();
