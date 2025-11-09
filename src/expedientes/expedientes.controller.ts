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
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExpedientesService } from './expedientes.service';
import { Expediente, EstadoExpediente } from './expediente.entity';
import { DocumentoRef } from 'src/documentos/documento-ref.entity';
import { CreateExpedienteDto } from './dto/create-expediente.dto';
import { UpdateExpedienteDto } from './dto/update-expediente.dto';
import { CreateDocumentoRefDto } from './dto/create-documento-ref.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('expedientes')
export class ExpedientesController {
  constructor(
    private readonly servicio: ExpedientesService,
    private readonly jwt: JwtService,
  ) {}

  // Crear expediente
  @Post()
  async crearExpediente(@Body() cuerpo: CreateExpedienteDto): Promise<Expediente> {
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
  // GET /expedientes/mis -> usa el token del cliente para devolver solo sus expedientes
  // Colocado antes de las rutas dinámicas para que 'mis' no sea interpretado como id_expediente
  @Get('mis')
  async listarMisExpedientes(
    @Headers('authorization') authorization?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('estado') estado?: EstadoExpediente,
    @Query('q') q?: string,
  ): Promise<Expediente[]> {
    if (!authorization) throw new UnauthorizedException('Se requiere Authorization header');
    const parts = authorization.split(' ');
    const token = parts.length === 2 && /^Bearer$/i.test(parts[0]) ? parts[1] : parts[0];

    let payload: any;
    try {
      payload = this.jwt.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }

    // validar que sea token de cliente
    if (!payload || payload.tipo !== 'CLIENTE' || typeof payload.sub !== 'number') {
      throw new UnauthorizedException('Token de cliente requerido');
    }

    const idCli = payload.sub as number;

    const DEFAULT_LIMIT = 25;
    const MAX_LIMIT = 200;
    const DEFAULT_OFFSET = 0;

    const rawLimit = limit !== undefined ? Number(limit) || DEFAULT_LIMIT : DEFAULT_LIMIT;
    const lim = Math.min(MAX_LIMIT, Math.max(1, rawLimit));

    const rawOffset = offset !== undefined ? Number(offset) || DEFAULT_OFFSET : DEFAULT_OFFSET;
    const off = Math.max(0, rawOffset);

    return this.servicio.listarTodos({
      limit: lim,
      offset: off,
      id_cliente: idCli,
      estado,
      q,
    });
  }

  // Obtener por id
  // Rutas dinámicas sin regex (Nest/Swagger/path-to-regexp evitan patrones complejos aquí)
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
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 25 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  async listarExpedientes(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('id_cliente') id_cliente?: string,
    @Query('estado') estado?: EstadoExpediente,
    @Query('q') q?: string,
  ): Promise<Expediente[]> {
    const DEFAULT_LIMIT = 25;
    const MAX_LIMIT = 200;
    const DEFAULT_OFFSET = 0;

    const rawLimit = limit !== undefined ? Number(limit) || DEFAULT_LIMIT : DEFAULT_LIMIT;
    const lim = Math.min(MAX_LIMIT, Math.max(1, rawLimit));

    const rawOffset = offset !== undefined ? Number(offset) || DEFAULT_OFFSET : DEFAULT_OFFSET;
    const off = Math.max(0, rawOffset);
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
    @Body() cuerpo: UpdateExpedienteDto,
  ): Promise<Expediente> {
    return this.servicio.actualizarParcial(id_expediente, cuerpo as Partial<Expediente>);
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
    @Body() body: CreateDocumentoRefDto,
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
