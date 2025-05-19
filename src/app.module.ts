import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './auth/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig],
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
