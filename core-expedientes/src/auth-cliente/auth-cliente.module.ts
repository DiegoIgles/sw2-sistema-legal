import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthClienteService } from './auth-cliente.service';
import { AuthClienteController } from './auth-cliente.controller';
import { Cliente } from 'src/clientes/cliente.entity';
import { ClienteCredencial } from './cliente-credencial.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Cliente, ClienteCredencial]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        // lee JWT_EXPIRES y lo convierte al tipo aceptado por JwtSignOptions
        const raw = cfg.get<string>('JWT_EXPIRES') ?? '8h';
        const expiresIn: JwtSignOptions['expiresIn'] =
          /^\d+$/.test(raw) ? Number(raw) : (raw as unknown as JwtSignOptions['expiresIn']);

        return {
          secret: cfg.get('JWT_CLIENT_SECRET') || cfg.get('JWT_SECRET') || 'cambia_esto_en_env',
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthClienteController],
  providers: [AuthClienteService],
})
export class AuthClienteModule {}
