import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health/health.controller';

import { ClientesModule } from './clientes/clientes.module';
import { ExpedientesModule } from './expedientes/expedientes.module';
import { NotasModule } from './notas/notas.module';
import { PlazosModule } from './plazos/plazos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ClienteCredencial } from './auth-cliente/cliente-credencial.entity';
import { AuthClienteModule } from './auth-cliente/auth-cliente.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // lee .env

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST'),
        port: parseInt(cfg.get<string>('DB_PORT') || '5432', 10),
        username: cfg.get<string>('DB_USERNAME') || cfg.get<string>('DB_USER'),
        password: cfg.get<string>('DB_PASSWORD') || cfg.get<string>('DB_PASS'),
        database: cfg.get<string>('DB_NAME'),
        autoLoadEntities: true,   // así no listas entities manualmente
        synchronize: (cfg.get<string>('NODE_ENV') || process.env.NODE_ENV) !== 'production',
      }),
    }),

    ClientesModule,
    ExpedientesModule,
    NotasModule,
    PlazosModule,
    UsuariosModule,
    AuthModule,
    ClienteCredencial,
    AuthClienteModule,
    TerminusModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
