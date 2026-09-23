import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Plataforma de Cursos API')
    .setDescription(
      'API REST acadêmica e financeira com NestJS, Prisma, PostgreSQL e JWT',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'token',
    )
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));

  const porta = process.env.PORT ?? 3000;
  await app.listen(porta);
  console.log(`API disponível em http://localhost:${porta}/api`);
}

void bootstrap();
