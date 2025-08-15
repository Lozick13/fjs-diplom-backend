import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

const start = async () => {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Cайт-агрегатор просмотра и бронирования гостиниц')
    .setDescription('Документация проекта')
    .addTag('lozick13')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 24000 * 3600,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(PORT, () => {
    console.log(`Сервер запущен на порту: ${PORT}`);
  });
};

void start();
