import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '@/auth/enum/roles.enum';
import { Exclude, Expose } from 'class-transformer';
import { Profile } from './profile.entity';

export class User {
  id: string;
  email: string;
  username: string;
  
  @Exclude({ toPlainOnly: true }) // Solo excluir al convertir a JSON, no al crear la instancia
  password: string;
  
  isActive: boolean;
  profile: Profile;
  createdAt: Date;
  updatedAt: Date;
  
  // Exponer la contraseña solo cuando se solicite explícitamente
  @Expose({ groups: ['password'] })
  getPassword(): string | undefined {
    return this.password;
  }

  constructor(partial: Partial<User>) {
    if (!partial.email) throw new Error('Email is required');
    if (!partial.username) throw new Error('Username is required');
    if (!partial.password) throw new Error('Password is required');

    this.id = partial.id || uuidv4();
    this.email = partial.email;
    this.username = partial.username;
    this.password = partial.password;
    this.isActive = partial.isActive !== undefined ? partial.isActive : true;
    this.profile = partial.profile || new Profile({});
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = new Date();
  }
}

