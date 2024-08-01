import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { ACCESS_DENIED } from 'src/constant/message';
import { UserService } from 'src/module/users/user.service';
import { RedisService } from 'src/shared/redis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.key'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const { iat, exp, id } = payload;
    const timeDiff: number = exp - iat;

    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }
    const bearerToken = req.headers['authorization']?.split(' ')?.[1];
    const tokenUser = await this.redisService.getValue(`access_token:${id}`);
    // const refreshUser = await this.redisService.getValue(`refresh_token:${id}`);

    if (!bearerToken || bearerToken !== tokenUser) {
      await this.redisService.delValue(`access_token:${id}`);
      await this.redisService.delValue(`refresh_token:${id}`);
      throw new UnauthorizedException(ACCESS_DENIED, { cause: null });
    }

    return { id: id };
  }
}
