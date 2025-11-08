import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Expediente, EstadoExpediente } from './expediente.entity';
import { Cliente } from 'src/clientes/cliente.entity';
import { DocumentoRef } from 'src/documentos/documento-ref.entity';

@Injectable()
export class ExpedientesService {
  constructor(
    @InjectRepository(Expediente) private readonly repo: Repository<Expediente>,
    @InjectRepository(Cliente) private readonly repoCliente: Repository<Cliente>,
    @InjectRepository(DocumentoRef) private readonly repoDocRef: Repository<DocumentoRef>,
  ) {}

  async crearExpediente(datos: {
    titulo: string;
    descripcion?: string;
    estado?: EstadoExpediente;
    fecha_inicio?: Date;
    fecha_cierre?: Date;
    id_cliente: number;
  }): Promise<Expediente> {
    const cliente = await this.repoCliente.findOne({ where: { id_cliente: datos.id_cliente } });
    if (!cliente) throw new NotFoundException('Cliente asociado no encontrado');

    const exp = this.repo.create({
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      estado: datos.estado ?? EstadoExpediente.ABIERTO,
      fecha_inicio: datos.fecha_inicio,
      fecha_cierre: datos.fecha_cierre,
      cliente,
    });

    return this.repo.save(exp);
  }

  async buscarPorId(id_expediente: number): Promise<Expediente | null> {
    return this.repo.findOne({
      where: { id_expediente },
      relations: { cliente: true }, // útil en vistas
    });
  }

  async listarTodos(filtro?: {
    limit?: number;
    offset?: number;
    id_cliente?: number;
    estado?: EstadoExpediente;
    q?: string;
  }): Promise<Expediente[]> {
    const where: any = {};
    if (filtro?.id_cliente) where.cliente = { id_cliente: filtro.id_cliente };
    if (filtro?.estado) where.estado = filtro.estado;
    if (filtro?.q) where.titulo = ILike(`%${filtro.q}%`);

    return this.repo.find({
      where,
      relations: { cliente: true },
      order: { fecha_creacion: 'DESC' },
      take: filtro?.limit,
      skip: filtro?.offset,
    });
  }

  async actualizarParcial(id_expediente: number, cambios: Partial<Expediente>): Promise<Expediente> {
    const exp = await this.buscarPorId(id_expediente);
    if (!exp) throw new NotFoundException('Expediente no encontrado');

    // si viene cambio de cliente
    if ((cambios as any)?.cliente?.id_cliente) {
      const cliente = await this.repoCliente.findOne({
        where: { id_cliente: (cambios as any).cliente.id_cliente },
      });
      if (!cliente) throw new NotFoundException('Nuevo cliente no existe');
      (cambios as any).cliente = cliente;
    }

    Object.assign(exp, cambios);
    return this.repo.save(exp);
    // Nota: si cambias estado a CERRADO, podrías setear fecha_cierre si no tiene
  }

  async eliminar(id_expediente: number): Promise<void> {
    await this.repo.delete(id_expediente);
  }

  // -------- DocumentoRef --------

  async agregarDocumentoRef(
    id_expediente: number,
    data: { doc_id_storage: string; titulo?: string; tipo?: string },
  ): Promise<DocumentoRef> {
    const exp = await this.repo.findOne({ where: { id_expediente } });
    if (!exp) throw new NotFoundException('Expediente no encontrado');

    const ref = this.repoDocRef.create({
      expediente: exp,
      doc_id_storage: data.doc_id_storage,
      titulo: data.titulo ?? null,
      tipo: data.tipo ?? null,
    });

    return this.repoDocRef.save(ref);
  }

  async listarDocumentosRef(id_expediente: number): Promise<DocumentoRef[]> {
    return this.repoDocRef.find({
      where: { expediente: { id_expediente } },
      order: { fecha_creacion: 'DESC' },
      relations: { expediente: true },
    });
  }
}
