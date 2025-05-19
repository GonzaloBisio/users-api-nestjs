import { User } from '../entities/user.entity';

export interface UserFilterOptions {
  email?: string;
  username?: string;
  profileName?: string;
  role?: string;
  isActive?: boolean;
  searchTerm?: string; // For backward compatibility
}

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findAll(filters?: UserFilterOptions): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  existsWithEmail(email: string, excludeId?: string): Promise<boolean>;
}
