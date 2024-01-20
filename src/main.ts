import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Spotify API')
    .setDescription('The Spotify API provides endpoints for managing songs, artists, and albums.')
    .setVersion('1.0')
    .addTag('song', 'Endpoints related to songs')
    .addTag('artist', 'Endpoints related to artists')
    .addTag('album', 'Endpoints related to albums')
    .addTag('authentication', 'Endpoints related to authentication')
    .addTag('user', 'Endpoints related to user')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  await app.listen(env.PORT);
}
bootstrap();
