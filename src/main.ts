import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { AppModule } from './app.module';
import express from 'express';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  const allowedOrigins = [
    'http://localhost:5200',
    'http://192.168.20.163:5200',
    'https://api-test.edl.com.la',
    'https://evaluation360.edl.com.la',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const uploadBasePath = process.env.UPLOAD_BASE_PATH;
  if (!uploadBasePath) {
    throw new Error('UPLOAD_BASE_PATH is not defined');
  }

  app.use(
    '/upload',
    express.static(path.resolve(uploadBasePath), {
      maxAge: '7d',
      etag: true,
    }),
  );

  await app.listen(process.env.PORT ?? 5100);
}
bootstrap();
