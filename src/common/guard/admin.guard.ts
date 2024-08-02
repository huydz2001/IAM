import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  GoneException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/module/users/user.service';
import { RedisService } from 'src/shared/redis';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split(' ')[1];

      const decodeToken = this.jwtService.decode(token);

      if (!decodeToken) {
        throw new GoneException('Phiên đăng nhập đã hết hạn');
      }

      if (this.redisService.getValue('userAdmin') !== decodeToken.id) {
        throw new ForbiddenException('Quyền truy cập bị từ chối!');
      }
      return super.canActivate(context) as Promise<boolean>;
    } catch (exc) {
      throw new UnauthorizedException();
    }
  }

  handleRequest(err: Error, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
