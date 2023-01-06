import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );
  // app.useGlobalPipes(new ValidationPipe());
  // app.enableCors();
  // app.use(helmet());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
