import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Cliente } from 'src/clientes/cliente.entity';
import { ClienteCredencial } from './cliente-credencial.entity';

type PayloadCliente = { sub: number; tipo: 'CLIENTE' };

@Injectable()
export class AuthClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repoCliente: Repository<Cliente>,
    @InjectRepository(ClienteCredencial)
    private readonly repoCred: Repository<ClienteCredencial>,
    private readonly jwt: JwtService,
  ) {}

  private async existeEmail(email?: string | null): Promise<boolean> {
    if (!email) return false;
    return (await this.repoCred.count({ where: { email } })) > 0;
  }

  private async existeTelefono(telefono?: string | null): Promise<boolean> {
    if (!telefono) return false;
    return (await this.repoCred.count({ where: { telefono } })) > 0;
  }

  async register(datos: {
    id_cliente: number;
    email?: string;
    telefono?: string;
    password: string;
  }): Promise<{
    access_token: string;
    cliente: {
      id_cliente: number;
      nombre_completo: string;
      email: string | null;
      telefono: string | null;
    };
  }> {
    if (!datos?.password || datos.password.length < 6) {
      throw new BadRequestException('El password debe tener al menos 6 caracteres');
    }
    if (!datos?.email && !datos?.telefono) {
      throw new BadRequestException('Debes proporcionar email o teléfono');
    }

    const cliente = await this.repoCliente.findOne({
      where: { id_cliente: datos.id_cliente },
    });
    if (!cliente) throw new BadRequestException('Cliente no existe');

    if (await this.existeEmail(datos.email)) {
      throw new ConflictException('Email ya registrado');
    }
    if (await this.existeTelefono(datos.telefono)) {
      throw new ConflictException('Teléfono ya registrado');
    }

    const password_hash = await bcrypt.hash(datos.password, 10);

    const cred = this.repoCred.create({
      cliente,
      email: datos.email ?? null,
      telefono: datos.telefono ?? null,
      password_hash,
    });
    const guardado = await this.repoCred.save(cred);

    const payload: PayloadCliente = { sub: cliente.id_cliente, tipo: 'CLIENTE' };
    const access_token = await this.jwt.signAsync<PayloadCliente>(payload);

    return {
      access_token,
      cliente: {
        id_cliente: cliente.id_cliente,
        nombre_completo: cliente.nombre_completo,
        email: guardado.email,
        telefono: guardado.telefono,
      },
    };
  }

  async login(datos: {
    email?: string;
    telefono?: string;
    password: string;
  }): Promise<{
    access_token: string;
    cliente: {
      id_cliente: number;
      nombre_completo: string;
      email: string | null;
      telefono: string | null;
    };
  }> {
    if (!datos?.password) throw new BadRequestException('Password requerido');
    if (!datos?.email && !datos?.telefono) {
      throw new BadRequestException('Proporciona email o teléfono');
    }

    const cred = await this.repoCred.findOne({
      where: datos.email ? { email: datos.email } : { telefono: datos.telefono! },
      relations: { cliente: true },
    });
    if (!cred) throw new UnauthorizedException('Credenciales inválidas');

    const ok = await bcrypt.compare(datos.password, cred.password_hash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    const payload: PayloadCliente = { sub: cred.cliente.id_cliente, tipo: 'CLIENTE' };
    const access_token = await this.jwt.signAsync<PayloadCliente>(payload);

    return {
      access_token,
      cliente: {
        id_cliente: cred.cliente.id_cliente,
        nombre_completo: cred.cliente.nombre_completo,
        email: cred.email,
        telefono: cred.telefono,
      },
    };
  }
}
