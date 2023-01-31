import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  console.log('process.env.FRONTEND_URI', process.env.FRONTEND_URI);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
