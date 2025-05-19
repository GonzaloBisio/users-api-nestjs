import { UnauthorizedException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";
import { AuthJwtPayload } from "../types/auth-jwt-payload.interface";
import { Inject } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(jwtConfig.KEY) jwtConfiguration: ConfigType<typeof jwtConfig>, private authService: AuthService) {
    if (!jwtConfiguration.secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    const userId = payload.sub;
    return this.authService.validateJwtUser(userId);
  }
}