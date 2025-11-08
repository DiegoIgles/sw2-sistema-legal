import { Controller, Post, Body } from '@nestjs/common';
import { AuthClienteService } from './auth-cliente.service';

@Controller('auth-cliente')
export class AuthClienteController {
  constructor(private readonly servicio: AuthClienteService) {}

  @Post('register')
  register(@Body() cuerpo: {
    id_cliente: number;
    email?: string;
    telefono?: string;
    password: string;
  }) {
    return this.servicio.register(cuerpo);
  }

  @Post('login')
  login(@Body() cuerpo: { email?: string; telefono?: string; password: string }) {
    return this.servicio.login(cuerpo);
  }
}
