import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nota } from './nota.entity';
import { Expediente } from 'src/expedientes/expediente.entity';

@Injectable()
export class NotasService {
  constructor(
    @InjectRepository(Nota)
    private readonly repoNota: Repository<Nota>,
    @InjectRepository(Expediente)
    private readonly repoExpediente: Repository<Expediente>,
  ) {}

  async crearNota(datos: {
    id_expediente: number;
    contenido: string;
    tipo?: string | null;
  }): Promise<Nota> {
    const expediente = await this.repoExpediente.findOne({
      where: { id_expediente: datos.id_expediente },
    });
    if (!expediente) throw new NotFoundException('Expediente no encontrado');

    const nueva = this.repoNota.create({
      contenido: datos.contenido,
      tipo: datos.tipo ?? null,
      expediente,
    });
    return await this.repoNota.save(nueva);
  }

  async obtenerPorId(id_nota: number): Promise<Nota | null> {
    return await this.repoNota.findOne({ where: { id_nota } });
  }

  async listarPorExpediente(id_expediente: number): Promise<Nota[]> {
    return await this.repoNota.find({
      where: { expediente: { id_expediente } },
      order: { id_nota: 'DESC' },
    });
  }

  async actualizarParcial(
    id_nota: number,
    cambios: Partial<Nota>,
  ): Promise<Nota> {
    const nota = await this.obtenerPorId(id_nota);
    if (!nota) throw new NotFoundException('Nota no encontrada');

    Object.assign(nota, cambios);
    return await this.repoNota.save(nota);
  }

  async eliminar(id_nota: number): Promise<void> {
    await this.repoNota.delete(id_nota);
  }
}
