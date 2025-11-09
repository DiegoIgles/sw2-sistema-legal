// ...existing code...
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nota } from './nota.entity';
import { Expediente } from 'src/expedientes/expediente.entity';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';

@Injectable()
export class NotasService {
  private readonly logger = new Logger(NotasService.name);

  constructor(
    @InjectRepository(Nota)
    private readonly repoNota: Repository<Nota>,
    @InjectRepository(Expediente)
    private readonly repoExpediente: Repository<Expediente>,
    private readonly realtime: RealtimeGateway,
  ) {}

  async crearNota(datos: {
    id_expediente: number;
    contenido: string;
    tipo?: string | null;
  }): Promise<Nota> {
    // 1) Validamos expediente (tu entity ya trae cliente eager)
    const expediente = await this.repoExpediente.findOne({
      where: { id_expediente: datos.id_expediente },
    });
    if (!expediente) throw new NotFoundException('Expediente no encontrado');

    // 2) Creamos y guardamos la nota
    const nueva = this.repoNota.create({
      contenido: datos.contenido,
      tipo: datos.tipo ?? null,
      expediente,
    });
    const guardada = await this.repoNota.save(nueva);

    // Log de creación (siempre)
    this.logger.log(
      `Nota creada id=${guardada.id_nota} exp=${expediente.id_expediente} cliente=${expediente.cliente?.id_cliente}`,
    );

    // 3) Emitimos por sockets a la sala del cliente (el gateway loguea clients en la sala)
    try {
      const idCliente = expediente.cliente?.id_cliente;
      if (idCliente) {
        await this.realtime.emitNotaCreada(idCliente, {
          id_expediente: expediente.id_expediente,
          id_nota: guardada.id_nota,
          contenido: guardada.contenido,
          tipo: guardada.tipo ?? '',
          fecha_registro: guardada.fecha_registro,
        });
      } else {
        this.logger.warn('Expediente sin cliente asociado; no se emite socket');
      }
    } catch (e) {
      // No romper el flujo si falla la emisión
      this.logger.warn(`No se pudo emitir evento de nota: ${e?.message || e}`);
    }

    return guardada;
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
  // Listar todas las notas de un cliente (por id_cliente)
  async listarPorCliente(id_cliente: number): Promise<Nota[]> {
    // Busca todas las notas cuyos expedientes pertenecen al cliente
    return this.repoNota.find({
      where: { expediente: { cliente: { id_cliente } } },
      order: { id_nota: 'DESC' },
      relations: { expediente: true },
    });
  }
}
