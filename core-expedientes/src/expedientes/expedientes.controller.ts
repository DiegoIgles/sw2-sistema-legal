import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ExpedientesService } from './expedientes.service';
import { Expediente, EstadoExpediente } from './expediente.entity';
import { DocumentoRef } from 'src/documentos/documento-ref.entity';

@Controller('expedientes')
export class ExpedientesController {
  constructor(private readonly servicio: ExpedientesService) {}

  // Crear expediente
  @Post()
  async crearExpediente(
    @Body() cuerpo: {
      titulo: string;
      descripcion?: string;
      estado?: EstadoExpediente;
      fecha_inicio?: string; // 'YYYY-MM-DD'
      fecha_cierre?: string; // 'YYYY-MM-DD'
      id_cliente: number;
    },
  ): Promise<Expediente> {
    if (!cuerpo.titulo || cuerpo.titulo.trim() === '') {
      throw new Error('El titulo es obligatorio');
    }
    return this.servicio.crearExpediente({
      titulo: cuerpo.titulo,
      descripcion: cuerpo.descripcion,
      estado: cuerpo.estado,
      fecha_inicio: cuerpo.fecha_inicio ? new Date(cuerpo.fecha_inicio) : undefined,
      fecha_cierre: cuerpo.fecha_cierre ? new Date(cuerpo.fecha_cierre) : undefined,
      id_cliente: cuerpo.id_cliente,
    });
  }

  // Obtener por id
  @Get(':id_expediente')
  async obtenerExpediente(
    @Param('id_expediente', ParseIntPipe) id_expediente: number,
  ): Promise<Expediente> {
    const expediente = await this.servicio.buscarPorId(id_expediente);
    if (!expediente) {
      throw new NotFoundException('Expediente no encontrado');
    }
    return expediente;
  }

  // Listar todos (con filtros y paginación opcional)
  // GET /expedientes?limit=25&offset=0&id_cliente=1&estado=ABIERTO&q=demanda
  @Get()
  async listarExpedientes(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('id_cliente') id_cliente?: string,
    @Query('estado') estado?: EstadoExpediente,
    @Query('q') q?: string,
  ): Promise<Expediente[]> {
    const lim = limit ? Math.min(200, Math.max(1, Number(limit))) : undefined;
    const off = offset ? Math.max(0, Number(offset)) : undefined;
    const idCli = id_cliente ? Number(id_cliente) : undefined;

    return this.servicio.listarTodos({
      limit: lim,
      offset: off,
      id_cliente: idCli,
      estado,
      q,
    });
  }

  // Actualizar parcial
  @Patch(':id_expediente')
  async actualizarExpediente(
    @Param('id_expediente', ParseIntPipe) id_expediente: number,
    @Body() cuerpo: Partial<Expediente>,
  ): Promise<Expediente> {
    return this.servicio.actualizarParcial(id_expediente, cuerpo);
  }

  // Eliminar
  @Delete(':id_expediente')
  async eliminarExpediente(
    @Param('id_expediente', ParseIntPipe) id_expediente: number,
  ): Promise<void> {
    return this.servicio.eliminar(id_expediente);
  }

  // ---------- DocumentosRef (enlazar con el servicio de documentos) ----------

  // POST /expedientes/:id_expediente/documentos { doc_id_storage, titulo?, tipo? }
  @Post(':id_expediente/documentos')
  async agregarDocumentoRef(
    @Param('id_expediente', ParseIntPipe) id_expediente: number,
    @Body() body: { doc_id_storage: string; titulo?: string; tipo?: string },
  ): Promise<DocumentoRef> {
    return this.servicio.agregarDocumentoRef(id_expediente, body);
  }

  // GET /expedientes/:id_expediente/documentos
  @Get(':id_expediente/documentos')
  async listarDocumentosRef(
    @Param('id_expediente', ParseIntPipe) id_expediente: number,
  ): Promise<DocumentoRef[]> {
    return this.servicio.listarDocumentosRef(id_expediente);
  }
}
