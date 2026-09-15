import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  app.setGlobalPrefix('api/v1');
  logger.debug(`Staring app...`);
  await app.listen(port, '0.0.0.0');
  logger.debug(`App running on port: ${port}`);
}
await bootstrap();
