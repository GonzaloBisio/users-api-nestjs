import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../auth/enum/roles.enum';

export class UserFilterDto {
  @ApiPropertyOptional({
    description: 'Filter users by email',
    example: 'user@example.com',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter users by role',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Filter users by name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter users by active status',
    example: true,
  })
  @IsOptional()
  isActive?: boolean;
}
