// src/main.ts
import 'reflect-metadata';

// Polyfill mínimo para `globalThis.crypto.randomUUID` en Node < 19
// Debe ejecutarse antes de importar cualquier módulo que use `crypto`.
// Usamos casting a `any` para evitar chocar con las declaraciones de tipo del lib.dom
if (typeof (globalThis as any).crypto === 'undefined') {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const nodeCrypto = require('crypto');
  // node >= 16 tiene randomUUID en crypto; webcrypto está disponible en algunas versiones
  (globalThis as any).crypto = nodeCrypto.webcrypto ?? { randomUUID: nodeCrypto.randomUUID?.bind(nodeCrypto) };
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  // Swagger setup - documentación en /docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Sistema Legal')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDoc);

  // Habilitar validación global para que los DTOs con class-validator funcionen
  // y transformar payloads a instancias de clases (required para Swagger + validation)
  const { ValidationPipe } = await import('@nestjs/common');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

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
