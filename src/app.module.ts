import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientesModule } from './clientes/clientes.module';
import { ExpedientesModule } from './expedientes/expedientes.module';
import { NotasModule } from './notas/notas.module';
import { PlazosModule } from './plazos/plazos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ClienteCredencial } from './auth-cliente/cliente-credencial.entity';
import { AuthClienteModule } from './auth-cliente/auth-cliente.module';
import { RealtimeModule } from './realtime/realtime.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // lee .env

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST'),
        port: parseInt(cfg.get<string>('DB_PORT') || '5432', 10),
        username: cfg.get<string>('DB_USERNAME'),
        password: cfg.get<string>('DB_PASSWORD'),
        database: cfg.get<string>('DB_NAME'),
        autoLoadEntities: true,   // así no listas entities manualmente
        synchronize: true       // true solo en dev si no usas migraciones
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
    RealtimeModule
  ],
})
export class AppModule {}
