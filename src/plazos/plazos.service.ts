import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Plazo } from './plazo.entity';
import { Expediente } from 'src/expedientes/expediente.entity';

@Injectable()
export class PlazosService {
  constructor(
    @InjectRepository(Plazo)
    private readonly repoPlazo: Repository<Plazo>,
    @InjectRepository(Expediente)
    private readonly repoExpediente: Repository<Expediente>,
  ) {}

  async crearPlazo(datos: {
    id_expediente: number;
    descripcion: string;
    fecha_vencimiento: Date;
  }): Promise<Plazo> {
    const expediente = await this.repoExpediente.findOne({
      where: { id_expediente: datos.id_expediente },
    });
    if (!expediente) throw new NotFoundException('Expediente no encontrado');

    const nuevo = this.repoPlazo.create({
      descripcion: datos.descripcion,
      fecha_vencimiento: datos.fecha_vencimiento,
      expediente,
    });
    return await this.repoPlazo.save(nuevo);
  }

  async obtenerPorId(id_plazo: number): Promise<Plazo | null> {
    return await this.repoPlazo.findOne({ where: { id_plazo } });
  }

  async listarPorExpediente(id_expediente: number): Promise<Plazo[]> {
    return await this.repoPlazo.find({
      where: { expediente: { id_expediente } },
      order: { fecha_vencimiento: 'ASC' },
    });
  }

  async listarVencidos(hastaFecha: Date): Promise<Plazo[]> {
    return await this.repoPlazo.find({
      where: { fecha_vencimiento: LessThanOrEqual(hastaFecha), cumplido: false },
      order: { fecha_vencimiento: 'ASC' },
    });
  }

  async marcarCumplido(id_plazo: number): Promise<Plazo> {
    const plazo = await this.obtenerPorId(id_plazo);
    if (!plazo) throw new NotFoundException('Plazo no encontrado');

    plazo.cumplido = true;
    plazo.fecha_cumplimiento = new Date();
    return await this.repoPlazo.save(plazo);
  }

  async actualizarParcial(id_plazo: number, cambios: Partial<Plazo>): Promise<Plazo> {
    const plazo = await this.obtenerPorId(id_plazo);
    if (!plazo) throw new NotFoundException('Plazo no encontrado');

    Object.assign(plazo, cambios);
    return await this.repoPlazo.save(plazo);
  }

  async eliminar(id_plazo: number): Promise<void> {
    await this.repoPlazo.delete(id_plazo);
  }
}
