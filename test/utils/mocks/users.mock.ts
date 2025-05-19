import { UserRole } from '@/auth/enum/roles.enum';
import { User } from '@/users/entities/user.entity';

export const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  password: '$2b$10$examplehashedpassword', // bcrypt hash for 'password123'
  isActive: true,
  profile: {
    role: UserRole.USER,
    firstName: 'Test',
    lastName: 'User',
    phone: '123456789',
    address: 'Test Address'
  },
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z'),
  getPassword: function (): string | undefined {
    throw new Error('Function not implemented.');
  }
};

export const mockAdminUser: User = {
  ...mockUser,
  email: 'admin@example.com',
  username: 'adminuser',
  profile: {
    ...mockUser.profile,
    role: UserRole.ADMIN,
  },
  getPassword: function (): string | undefined {
    throw new Error('Function not implemented.');
  }
};

export const mockCreateUserDto = {
  email: 'newuser@example.com',
  username: 'newuser',
  password: 'password123',
  isActive: true,
  profile: {
    role: UserRole.USER,
    firstName: 'New',
    lastName: 'User',
    phone: '987654321',
    address: 'New Address',
  },
};

export const mockUpdateUserDto = {
  username: 'updateduser',
  profile: {
    firstName: 'Updated',
    lastName: 'Name',
  },
};
