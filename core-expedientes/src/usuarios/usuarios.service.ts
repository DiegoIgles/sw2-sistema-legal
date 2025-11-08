import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repoUsuario: Repository<Usuario>,
  ) {}

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return await this.repoUsuario.findOne({ where: { email } });
  }

  async existePorEmail(email: string): Promise<boolean> {
    const c = await this.repoUsuario.count({ where: { email } });
    return c > 0;
  }

  async crearUsuario(datos: {
    email: string;
    password_hash: string;
    rol?: string;
  }): Promise<Usuario> {
    const nuevo = this.repoUsuario.create({
      email: datos.email,
      password_hash: datos.password_hash,
      rol: datos.rol ?? 'OPERADOR',
    });
    return await this.repoUsuario.save(nuevo);
  }
}
