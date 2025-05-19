import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'usuario@ejemplo.com', 
    description: 'Correo electrónico del usuario',
    required: true 
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ 
    example: 'contraseña123', 
    description: 'Contraseña del usuario',
    required: true,
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

export class LoginResponseDto {
  id!: string;
  token!: string;
}
