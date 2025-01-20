import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './presentation/modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS pour autoriser localhost:3001
  app.enableCors({
    origin: 'http://localhost:3001', // Autorise cette origine uniquement
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    preflightContinue: false, // Répond automatiquement aux requêtes OPTIONS
    optionsSuccessStatus: 204, // Réponse pour les requêtes OPTIONS
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    preflightContinue: false, // Répond automatiquement aux requêtes OPTIONS
    optionsSuccessStatus: 204, // Réponse pour les requêtes OPTIONS
  });

  // Add "/api" before all routes
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Omni Feed Hub')
    .setDescription('API documentation for Omni Feed Hub')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
