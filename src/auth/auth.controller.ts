import { Controller, Post, HttpCode, HttpStatus, Body, UseGuards, Req } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiTags, 
  ApiBearerAuth, 
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiProperty
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthJwtPayload } from './types/auth-jwt-payload.interface';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefresAuthGuard } from './guards/refres-auth/refres-auth.guard';

@Controller('auth')
@ApiTags('Autenticación')
@ApiResponse({ status: 401, description: 'No autorizado' })
@ApiResponse({ status: 400, description: 'Parámetros inválidos' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica al usuario y devuelve los tokens de acceso y refresco.'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Credenciales de inicio de sesión',
    examples: {
      admin: {
        summary: 'Inicio de sesión de administrador',
        value: { email: 'admin@example.com', password: 'admin123' }
      },
      user: {
        summary: 'Inicio de sesión de usuario',
        value: { email: 'usuario@example.com', password: 'usuario123' }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Inicio de sesión exitoso',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Credenciales inválidas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciales inválidas' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array',
          items: { type: 'string' },
          example: ['email must be an email', 'password should not be empty']
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefresAuthGuard)
  @ApiOperation({ 
    summary: 'Refrescar token de acceso',
    description: 'Genera un nuevo par de tokens usando un refresh token válido.'
  })
  @ApiBearerAuth('refresh-token')
  @ApiResponse({
    status: 200,
    description: 'Token de acceso refrescado exitosamente',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token de refresco inválido o expirado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      },
    },
  })
  async refresh(@Req() req: any) {
    // El usuario ya está validado por el guard
    const user = req.user;
    
    // Generar nuevos tokens
    const payload: AuthJwtPayload = { 
      sub: user.sub, 
      email: user.email, 
      role: user.role 
    };
    
    return this.authService.generateTokens(payload);
  }

}
