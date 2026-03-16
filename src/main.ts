import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ── Global validation pipe ──────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Swagger / OpenAPI setup ─────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Star Wars API')
    .setDescription(
      'RESTful API built with NestJS that exposes Star Wars universe data.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
  process.stdout.write(
    `Application running on: http://localhost:${process.env.PORT ?? 3000}\n`,
  );
  process.stdout.write(
    `Swagger UI available at:  http://localhost:${process.env.PORT ?? 3000}/documentation\n`,
  );
}
void bootstrap();
