// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS para tu frontend (CRA en :3001)
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:8081'], // agrega otros orígenes si los necesitas
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false, // pon true solo si usaras cookies/sesiones
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
