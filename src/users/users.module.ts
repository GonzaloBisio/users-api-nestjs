import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { InMemoryUserRepository } from './repositories/in-memory-user.repository';
import { AuthModule } from '../auth/auth.module';
import { UserInitService } from './services/user-init.service';

// Creamos un token de inyección
const userRepositoryProvider = {
  provide: 'IUserRepository',
  useClass: InMemoryUserRepository,
};

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserInitService,
    userRepositoryProvider,
  ],
  exports: [UsersService],
})
export class UsersModule {}
