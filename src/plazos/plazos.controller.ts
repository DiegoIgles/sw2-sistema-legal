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
import { PlazosService } from './plazos.service';
import { Plazo } from './plazo.entity';
import { CreatePlazoDto } from './dto/create-plazo.dto';
import { UpdatePlazoDto } from './dto/update-plazo.dto';
import { DefaultValuePipe } from '@nestjs/common';
@Controller()
export class PlazosController {
  constructor(private readonly servicioPlazos: PlazosService) { }

  @Post('plazos')
  async crear(@Body() cuerpo: CreatePlazoDto): Promise<Plazo> {
    if (!cuerpo.descripcion || cuerpo.descripcion.trim() === '') {
      throw new Error('La descripción es obligatoria');
    }
    if (!cuerpo.fecha_vencimiento) {
      throw new Error('La fecha_vencimiento es obligatoria');
    }

    return await this.servicioPlazos.crearPlazo({
      id_expediente: cuerpo.id_expediente,
      descripcion: cuerpo.descripcion,
      fecha_vencimiento: new Date(cuerpo.fecha_vencimiento),
    });
  }

  @Get('plazos/:id_plazo')
  async obtener(@Param('id_plazo', ParseIntPipe) id_plazo: number): Promise<Plazo> {
    const plazo = await this.servicioPlazos.obtenerPorId(id_plazo);
    if (!plazo) throw new NotFoundException('Plazo no encontrado');
    return plazo;
  }
  //todos los plazos
  @Get('plazos')
  async listarTodos(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(20)) limit: number,
    @Query('cumplido') cumplido?: 'true' | 'false',
  ): Promise<{ data: Plazo[]; total: number; page: number; limit: number }> {
    const filtroCumplido =
      cumplido === 'true' ? true : cumplido === 'false' ? false : undefined;

    const [data, total] = await this.servicioPlazos.listarTodos({
      page: Number(page),
      limit: Number(limit),
      cumplido: filtroCumplido,
    });

    return { data, total, page: Number(page), limit: Number(limit) };
  }

  @Get('expedientes/:id_expediente/plazos')
  async listarPorExpediente(
    @Param('id_expediente', ParseIntPipe) id_expediente: number,
  ): Promise<Plazo[]> {
    return await this.servicioPlazos.listarPorExpediente(id_expediente);
  }

  @Get('plazos-vencidos')
  async listarVencidos(@Query('hasta') hasta?: string): Promise<Plazo[]> {
    const fecha = hasta ? new Date(hasta) : new Date();
    return await this.servicioPlazos.listarVencidos(fecha);
  }

  @Patch('plazos/:id_plazo/cumplir')
  async marcarCumplido(@Param('id_plazo', ParseIntPipe) id_plazo: number): Promise<Plazo> {
    return await this.servicioPlazos.marcarCumplido(id_plazo);
  }

  @Patch('plazos/:id_plazo')
  async actualizar(
    @Param('id_plazo', ParseIntPipe) id_plazo: number,
    @Body() cuerpo: UpdatePlazoDto,
  ): Promise<Plazo> {
    return await this.servicioPlazos.actualizarParcial(id_plazo, cuerpo as Partial<Plazo>);
  }

  @Delete('plazos/:id_plazo')
  async eliminar(@Param('id_plazo', ParseIntPipe) id_plazo: number): Promise<void> {
    return await this.servicioPlazos.eliminar(id_plazo);
  }

}
