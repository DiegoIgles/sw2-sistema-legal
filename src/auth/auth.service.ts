import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  // LOGIN (ya tenías)
  async login(credenciales: { email: string; password: string }) {
    const usuario = await this.usuariosService.buscarPorEmail(credenciales.email);
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const coincide = await bcrypt.compare(credenciales.password, usuario.password_hash);
    if (!coincide) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: usuario.id_usuario, email: usuario.email, rol: usuario.rol };
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: { id_usuario: usuario.id_usuario, email: usuario.email, rol: usuario.rol },
    };
  }

  // REGISTER (nuevo)
  async register(datos: { email: string; password: string; rol?: string }) {
    // validaciones básicas
    if (!datos?.email || !datos?.password) {
      throw new BadRequestException('email y password son obligatorios');
    }
    if (datos.password.length < 6) {
      throw new BadRequestException('El password debe tener al menos 6 caracteres');
    }

    // unicidad
    const existe = await this.usuariosService.existePorEmail(datos.email);
    if (existe) {
      throw new ConflictException('El email ya está registrado');
    }

    // hash
    const password_hash = await bcrypt.hash(datos.password, 10);

    // crear usuario
    const usuario = await this.usuariosService.crearUsuario({
      email: datos.email,
      password_hash,
      rol: datos.rol, // opcional
    });

    // opcional: devolver token directo tras registro
    const payload = { sub: usuario.id_usuario, email: usuario.email, rol: usuario.rol };
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: { id_usuario: usuario.id_usuario, email: usuario.email, rol: usuario.rol },
    };
  }
}
