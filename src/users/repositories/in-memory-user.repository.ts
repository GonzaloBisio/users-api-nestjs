import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { IUserRepository, UserFilterOptions } from '../interfaces/user-repository.interface';
import { UserRole } from '@/auth/enum/roles.enum';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    
    // Ensure profile is a proper Profile instance
    const profile = userData.profile instanceof Profile 
      ? userData.profile 
      : new Profile(userData.profile || {});

    const newUser = new User({
      ...userData,
      id: uuidv4(),
      profile,
      createdAt: now,
      updatedAt: now,
    });
    
    this.users.push(newUser);
    return newUser;
  }

  async findAll(filters?: UserFilterOptions): Promise<User[]> {
    if (!filters || Object.keys(filters).length === 0) {
      return [...this.users];
    }

    // Handle legacy string filter for backward compatibility
    if (typeof filters === 'string' || (filters as any).searchTerm) {
      const searchTerm = (typeof filters === 'string' ? filters : (filters as any).searchTerm || '').toLowerCase();
      
      return this.users.filter(user => {
        const usernameMatch = user.username?.toLowerCase().includes(searchTerm) || false;
        const emailMatch = user.email?.toLowerCase().includes(searchTerm) || false;
        const firstNameMatch = user.profile?.firstName?.toLowerCase().includes(searchTerm) || false;
        const lastNameMatch = user.profile?.lastName?.toLowerCase().includes(searchTerm) || false;
        const fullNameMatch = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.toLowerCase().includes(searchTerm);
        
        return usernameMatch || emailMatch || firstNameMatch || lastNameMatch || fullNameMatch;
      });
    }

    // Handle specific field filters
    return this.users.filter(user => {
      if (filters.email && !user.email?.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }
      
      if (filters.username && !user.username?.toLowerCase().includes(filters.username.toLowerCase())) {
        return false;
      }
      
      if (filters.isActive !== undefined && user.isActive !== filters.isActive) {
        return false;
      }
      
      // Profile specific filters
      if (filters.profileName) {
        const fullName = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim().toLowerCase();
        if (!fullName.includes(filters.profileName.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    return this.users.find(user => user.email?.toLowerCase() === email.toLowerCase()) || null;
  }

  async update(id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    // Handle profile update
    const currentUser = this.users[userIndex];
    let updatedProfile: Profile;
    
    if (userData.profile) {
      if (userData.profile instanceof Profile) {
        updatedProfile = userData.profile;
      } else {
        const currentProfile = currentUser.profile || {};
        updatedProfile = new Profile({
          ...currentProfile,
          ...(userData.profile as Partial<Profile>)
        });
      }
    } else {
      updatedProfile = currentUser.profile || new Profile({});
    }
    
    const updatedUser = new User({
      ...this.users[userIndex],
      ...userData,
      profile: updatedProfile,
      updatedAt: new Date(),
    });
    
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return this.users.length < initialLength;
  }

  async existsWithEmail(email: string, excludeId?: string): Promise<boolean> {
    if (!email) return false;
    
    return this.users.some(
      user => user.email?.toLowerCase() === email.toLowerCase() && 
             (!excludeId || user.id !== excludeId)
    );
  }
}
