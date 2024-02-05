import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  if (!admin.apps.length) {
    const serviceAccount = require('../socloud-c68fb-firebase-adminsdk-2ir21-5d2de1354d.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE,
    });
  }
  const config = new DocumentBuilder()
    .setTitle('Spotify API')
    .setDescription('The Spotify API provides endpoints for managing songs, artists, and albums.')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('song', 'Endpoints related to songs')
    .addTag('artist', 'Endpoints related to artists')
    .addTag('album', 'Endpoints related to albums')
    .addTag('authentication', 'Endpoints related to authentication')
    .addTag('user', 'Endpoints related to user')
    .addTag('playlist', 'Endpoints related to playlist')
    .addTag('admin', 'Endpoints related to admin')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  await app.listen(env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
