import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class Jwt_Rt_Strategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_RT_SECRET'),
    });
  }

  async validate(req: Request, payload: any) {
    // const refreshToken = req?.cookies?.refresh_token;
    // console.log(refreshToken);
    return { payload, userId: payload.sub };
  }
}
