import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { 
  IsOptional, 
  IsString, 
  MinLength, 
  MaxLength, 
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { UserRole } from '@/auth/enum/roles.enum';

export class UpdateProfileDto extends PartialType(class {}) {
  @ApiPropertyOptional({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.ADMIN
  })
  @IsEnum(UserRole, { message: 'El rol proporcionado no es válido' })
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'John',
    minLength: 2,
    maxLength: 50
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Doe',
    minLength: 2,
    maxLength: 50
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
    example: '+541112345678',
    nullable: true
  })
  @IsPhoneNumber(undefined, { message: 'El número de teléfono no es válido' })
  @IsOptional()
  phone?: string | null;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Av. Siempre Viva 123',
    maxLength: 200,
    nullable: true
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MaxLength(200, { message: 'La dirección no puede tener más de 200 caracteres' })
  @IsOptional()
  address?: string | null;
}
