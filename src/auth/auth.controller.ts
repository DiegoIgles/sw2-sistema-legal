import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly servicioAuth: AuthService) {}

  @Post('login')
  async login(@Body() cuerpo: LoginAuthDto) {
    return await this.servicioAuth.login(cuerpo as any);
  }

  @Post('register')
  async register(@Body() cuerpo: RegisterAuthDto) {
    return await this.servicioAuth.register(cuerpo);
  }
}
