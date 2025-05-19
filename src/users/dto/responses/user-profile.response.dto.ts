import { UserRole } from '@/auth/enum/roles.enum';

export interface ProfileResponseDto {
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  role: UserRole;
}

export interface UserProfileResponseDto {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  profile: ProfileResponseDto;
}

// Esquema para la documentación de Swagger
export const userProfileApiSchema = {
  description: 'Perfil del usuario autenticado',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          username: { type: 'string' },
          isActive: { type: 'boolean' },
          profile: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              phone: { type: 'string', nullable: true },
              address: { type: 'string', nullable: true },
              role: { 
                type: 'string', 
                enum: Object.values(UserRole),
                example: UserRole.USER
              }
            },
            required: ['firstName', 'lastName', 'role']
          }
        },
        required: ['id', 'email', 'username', 'isActive', 'profile']
      }
    }
  }
};
