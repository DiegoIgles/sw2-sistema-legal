import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  Query,              // 👈 importa Query
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly servicioClientes: ClientesService) {}

  // GET /clientes  -> lista todos (con paginación opcional)
  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 25 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  async listarClientes(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<Cliente[]> {
    const DEFAULT_LIMIT = 25;
    const DEFAULT_OFFSET = 0;

    const rawLimit = limit !== undefined ? parseInt(limit, 10) || DEFAULT_LIMIT : DEFAULT_LIMIT;
    const lim = Math.max(1, Math.min(rawLimit, 100));

    const rawOffset = offset !== undefined ? parseInt(offset, 10) || DEFAULT_OFFSET : DEFAULT_OFFSET;
    const off = Math.max(0, rawOffset);

    return this.servicioClientes.listarTodos(lim, off);
  }

  @Post()
  async crearCliente(@Body() cuerpo: CreateClienteDto): Promise<Cliente> {
    if (!cuerpo.nombre_completo || cuerpo.nombre_completo.trim() === '') {
      throw new Error('El nombre_completo es obligatorio');
    }

    return await this.servicioClientes.crearCliente({
      nombre_completo: cuerpo.nombre_completo,
      contacto_email: cuerpo.contacto_email,
      contacto_tel: cuerpo.contacto_tel,
    });
  }

  @Get(':id_cliente')
  async obtenerCliente(
    @Param('id_cliente', ParseIntPipe) id_cliente: number,
  ): Promise<Cliente> {
    const cliente = await this.servicioClientes.buscarPorId(id_cliente);
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return cliente;
  }
}
