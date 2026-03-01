import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  /**
   * Valida las credenciales del usuario y genera un token JWT
   * @param loginDto - Email y contraseña del usuario
   * @returns Token JWT
   */
  async login(loginDto: LoginDto): Promise<{ access_token: string , detail}> {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new BadRequestException('Credenciales inválidas');
    }

    // Generar token
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const detail = {
      id:user.id,
      nombre: user.nombre,
      email: user.email,
      shift: user.shift,
      base: user.base,
      products: user.products,
      sales: user.sales,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      detail
    };
  }

  /**
   * Valida el token y retorna los datos del usuario
   * @param token - Token JWT
   * @returns Datos del usuario
   */
  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
