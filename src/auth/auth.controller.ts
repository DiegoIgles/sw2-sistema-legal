import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly servicioAuth: AuthService) {}

  @Post('login')
  async login(@Body() cuerpo: { email: string; password: string }) {
    return await this.servicioAuth.login(cuerpo);
  }

  @Post('register')
  async register(
    @Body() cuerpo: { email: string; password: string; rol?: string },
  ) {
    return await this.servicioAuth.register(cuerpo);
  }
}
