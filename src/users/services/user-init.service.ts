import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UserRole } from '@/auth/enum/roles.enum';


@Injectable()
export class UserInitService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createDefaultUser();
  }

  private async createDefaultUser() {
    try {
      // Get configuration from environment variables
      const defaultEmail = this.configService.get<string>('DEFAULT_USER_EMAIL');
      const defaultPassword = this.configService.get<string>('DEFAULT_USER_PASSWORD');

      if (!defaultEmail || !defaultPassword) {
        throw new Error('DEFAULT_USER_EMAIL and DEFAULT_USER_PASSWORD must be set in environment variables');
      }

      try {
        // Check if user already exists
        await this.usersService.findByEmail(defaultEmail);
        console.log('Default admin user already exists');
        return;
      } catch (error: any) {
        // If user doesn't exist (404), create it
        if (error.status === 404) {
          const createUserDto = {
            username: 'admin',
            email: defaultEmail,
            password: defaultPassword,
            isActive: true,
            profile: {
              role: UserRole.ADMIN,
              firstName: 'admin',
              lastName: 'example',
              phone: null,
              address: null
            }
          };
          
          const user = await this.usersService.create(createUserDto);
          console.log(`Default admin user created successfully with email: ${user.email}`);
          return;
        }
        // Re-throw other errors
        throw error;
      }
    } catch (error) {
      console.error('Error creating default user:', error);
      // Optionally re-throw to fail fast during development
      if (process.env.NODE_ENV !== 'production') {
        throw error;
      }
    }
  }
}
