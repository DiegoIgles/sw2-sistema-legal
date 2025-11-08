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

@Controller('clientes')
export class ClientesController {
  constructor(private readonly servicioClientes: ClientesService) {}

  // GET /clientes  -> lista todos (con paginación opcional)
  @Get()
  async listarClientes(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<Cliente[]> {
    const lim = limit ? Math.max(1, Math.min(parseInt(limit, 10) || 0, 100)) : undefined;
    const off = offset ? Math.max(0, parseInt(offset, 10) || 0) : undefined;
    return this.servicioClientes.listarTodos(lim, off);
  }

  @Post()
  async crearCliente(
    @Body() cuerpo: {
      nombre_completo: string;
      contacto_email?: string;
      contacto_tel?: string;
    },
  ): Promise<Cliente> {
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
