import { Controller, Post, Body } from '@nestjs/common';
import { AuthClienteService } from './auth-cliente.service';
import { RegisterAuthClienteDto } from './dto/register-auth-cliente.dto';
import { LoginAuthDto } from '../auth/dto/login-auth.dto';

@Controller('auth-cliente')
export class AuthClienteController {
  constructor(private readonly servicio: AuthClienteService) {}

  @Post('register')
  register(@Body() cuerpo: RegisterAuthClienteDto) {
    return this.servicio.register(cuerpo as any);
  }

  @Post('login')
  login(@Body() cuerpo: LoginAuthDto) {
    return this.servicio.login(cuerpo as any);
  }
}
