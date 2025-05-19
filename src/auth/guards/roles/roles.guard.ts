import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { UserRole } from '../../enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si no hay roles requeridos, permitir el acceso
    }

    const user = context.switchToHttp().getRequest().user;
    
    if (!user || !user.role) {
      throw new ForbiddenException('No se encontró información de roles del usuario');
    }

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException(`Se requiere uno de los siguientes roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
