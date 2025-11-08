import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repositorioCliente: Repository<Cliente>,
  ) {}

  async listarTodos(limit?: number, offset?: number): Promise<Cliente[]> {
    return this.repositorioCliente.find({
      order: { id_cliente: 'DESC' },
      ...(limit !== undefined ? { take: limit } : {}),
      ...(offset !== undefined ? { skip: offset } : {}),
      // Si deseas traer los expedientes en la misma consulta:
      // relations: { expedientes: true },
    });
  }

  async crearCliente(datosNuevoCliente: {
    nombre_completo: string;
    contacto_email?: string;
    contacto_tel?: string;
  }): Promise<Cliente> {
    const clienteNuevo = this.repositorioCliente.create(datosNuevoCliente);
    return await this.repositorioCliente.save(clienteNuevo);
  }

  async buscarPorId(id_cliente: number): Promise<Cliente | null> {
    return await this.repositorioCliente.findOne({
      where: { id_cliente },
      // relations: { expedientes: true }, // descomenta si quieres traer relaciones
    });
  }
}
