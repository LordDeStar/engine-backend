import { NestFactory } from '@nestjs/core';
import { RestApiModule } from './rest_api.module';

async function bootstrap() {
  const app = await NestFactory.create(RestApiModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
