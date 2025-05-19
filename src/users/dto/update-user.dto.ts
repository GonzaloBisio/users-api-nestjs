import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
  Min,
  Max,
  ValidateNested,
  MaxLength,
  IsBoolean
} from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
    maxLength: 255
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @MaxLength(255, { message: 'El correo electrónico no puede tener más de 255 caracteres' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Edad del usuario',
    minimum: 1,
    maximum: 150,
    example: 25
  })
  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(1, { message: 'La edad mínima es 1' })
  @Max(150, { message: 'La edad máxima es 150' })
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({
    description: 'Indica si el usuario está activo',
    default: true
  })
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Perfil del usuario',
    type: () => UpdateProfileDto
  })
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  @IsOptional()
  profile?: UpdateProfileDto;
}
