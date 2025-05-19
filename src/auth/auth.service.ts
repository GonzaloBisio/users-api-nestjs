import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { ConfigType } from '@nestjs/config';
import refreshJwtConfig from './config/refresh-jwt.config';
import { CurrentUser } from './types/current-user';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    public jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    public refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      return null;
    }
  }

  async validatePassword(user: any, password: string): Promise<boolean> {
    if (!user || !user.password) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }

  async login(credentials: LoginCredentials) {
    try {
      
      if (!credentials.email || !credentials.password) {
        throw new UnauthorizedException('Email y contraseña son requeridos');
      }

      const user = await this.usersService.findByEmail(credentials.email);
      
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const isPasswordValid = await this.validatePassword(user, credentials.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      
      const payload: AuthJwtPayload = { 
        sub: user.id,
        email: user.email,
        role: user.profile?.role || 'USER'
      };
      // Generar tokens y devolver datos del usuario
      const tokens = await this.generateTokens(payload);
      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.profile?.role || 'USER'
        }
      };
    } catch (error) {
      // Si ya es un UnauthorizedException, lo relanzamos
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Para otros errores, devolvemos un mensaje genérico
      throw new UnauthorizedException('Error en el proceso de autenticación');
    }
  }

  /**
   * Genera un nuevo par de tokens de acceso y refresh
   * @param payload Payload del usuario autenticado
   * @returns Objeto con access_token y refresh_token
   */
  async generateTokens(payload: AuthJwtPayload) {
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: this.refreshTokenConfig.secret,
        expiresIn: this.refreshTokenConfig.expiresIn
      })
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    const currentUser: CurrentUser = {
      id: user.id,
      role: user.profile.role
    };
    return currentUser;
  }
}
