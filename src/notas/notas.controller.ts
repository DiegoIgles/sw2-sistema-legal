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
} from '@nestjs/common';
import { NotasService } from './notas.service';
import { Nota } from './nota.entity';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';

@Controller()
export class NotasController {
  constructor(private readonly servicioNotas: NotasService) {}

  // Crear nota para un expediente
  @Post('notas')
  async crear(@Body() cuerpo: CreateNotaDto): Promise<Nota> {
    if (!cuerpo.contenido || cuerpo.contenido.trim() === '') {
      throw new Error('El contenido es obligatorio');
    }
    return await this.servicioNotas.crearNota({
      id_expediente: cuerpo.id_expediente,
      contenido: cuerpo.contenido,
      tipo: cuerpo.tipo,
    });
  }

  // Obtener nota por id
  @Get('notas/:id_nota')
  async obtener(
    @Param('id_nota', ParseIntPipe) id_nota: number,
  ): Promise<Nota> {
    const nota = await this.servicioNotas.obtenerPorId(id_nota);
    if (!nota) throw new NotFoundException('Nota no encontrada');
    return nota;
  }

  // Listar notas de un expediente
  @Get('expedientes/:id_expediente/notas')
  async listarPorExpediente(
    @Param('id_expediente', ParseIntPipe) id_expediente: number,
  ): Promise<Nota[]> {
    return await this.servicioNotas.listarPorExpediente(id_expediente);
  }

  // Actualizar parcialmente una nota
  @Patch('notas/:id_nota')
  async actualizar(
    @Param('id_nota', ParseIntPipe) id_nota: number,
    @Body() cuerpo: UpdateNotaDto,
  ): Promise<Nota> {
    return await this.servicioNotas.actualizarParcial(id_nota, cuerpo as Partial<Nota>);
  }

  // Eliminar una nota
  @Delete('notas/:id_nota')
  async eliminar(
    @Param('id_nota', ParseIntPipe) id_nota: number,
  ): Promise<void> {
    return await this.servicioNotas.eliminar(id_nota);
  }
}
