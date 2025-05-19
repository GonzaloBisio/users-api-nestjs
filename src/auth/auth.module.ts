import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import jwtConfig from './config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import refreshJwtConfig from './config/refresh-jwt.config';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
