
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const isPasswordValid = await this.authService.validatePassword(user, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Excluimos el password del objeto de retorno
    const { password: _, ...result } = user;
    return result;
  }
}
