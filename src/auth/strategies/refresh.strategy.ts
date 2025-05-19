import { UnauthorizedException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigType } from "@nestjs/config";
import refreshJwtConfig from "../config/refresh-jwt.config";
import { AuthJwtPayload } from "../types/auth-jwt-payload.interface";
import { Inject } from "@nestjs/common";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(@Inject(refreshJwtConfig.KEY) private RefreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>) {
    if (!RefreshJwtConfiguration.secret) {
      throw new Error('REFRESH_JWT_SECRET environment variable is not set');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: RefreshJwtConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    return { 
      id: payload.sub
    };
  }
}