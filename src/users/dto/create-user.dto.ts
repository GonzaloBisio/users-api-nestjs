import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsOptional, 
  IsInt, 
  Min, 
  Max, 
  ValidateNested,
  MaxLength,
  IsNotEmptyObject,
  IsBoolean} from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Nombre completo del usuario',
    example: 'GonzaloBisio',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  username?: string;

  @ApiProperty({ 
    description: 'Correo electrónico del usuario',
    example: 'gonzalo.bisio@gmail.com',
    maxLength: 255
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @MaxLength(255, { message: 'El correo electrónico no puede tener más de 255 caracteres' })
  email!: string;

  @ApiPropertyOptional({ 
    description: 'Edad del usuario',
    minimum: 1,
    maximum: 150,
    example: 25
  })
  @IsOptional()
  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(1, { message: 'La edad mínima es 1' })
  @Max(150, { message: 'La edad máxima es 150' })
  age?: number;

  @ApiProperty({ 
    description: 'Perfil del usuario',
    type: () => CreateProfileDto
  })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmptyObject({}, { message: 'El perfil es obligatorio' })
  profile!: CreateProfileDto;

  // Por defecto se establece al usuario como activo
  @ApiPropertyOptional({
    description: 'Indica si el usuario está activo',
    default: true
  })
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  isActive: boolean = true;

  @ApiProperty({ 
    description: 'Contraseña del usuario',
    minLength: 8,
    example: 'Gonzalo123',
    writeOnly: true
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;
}
