import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  constructor(init?: Partial<UserResponseDto>) {
    this.id = '';
    this.email = '';
    this.username = '';
    this.role = 'USER';
    
    if (init) {
      Object.assign(this, init);
    }
  }

  @ApiProperty({ 
    description: 'ID único del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com' 
  })
  email: string;

  @ApiProperty({ 
    description: 'Nombre de usuario',
    example: 'usuario' 
  })
  username: string;

  @ApiProperty({ 
    description: 'Rol del usuario',
    example: 'USER',
    enum: ['USER', 'ADMIN']
  })
  role: string;
}

export class AuthResponseDto {
  constructor(init?: Partial<AuthResponseDto>) {
    this.access_token = '';
    this.refresh_token = '';
    this.user = new UserResponseDto();
    
    if (init) {
      Object.assign(this, init);
      
      if (init.user) {
        this.user = new UserResponseDto(init.user);
      }
    }
  }

  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token de refresco JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
