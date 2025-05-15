import { ProjectsModule } from './projects.module';
import { NestFactory } from '@nestjs/core';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProjectsModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: "projects",
          brokers: ['kafka:9092']
        },
        consumer: {
          allowAutoTopicCreation: true,
          groupId: 'projects-service-group',
        },
      }
    });
  await app.listen();
}


bootstrap();
