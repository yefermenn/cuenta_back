import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Habilitar CORS para desarrollo
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`✅ Servidor ejecutándose en puerto ${port}`);
  });
}
bootstrap();
