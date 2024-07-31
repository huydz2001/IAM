import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_AUTH, EVENT_REDIS } from 'src/constant/event-emitter.constant';
import { TokenLoginDto } from './dtos';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @OnEvent(EVENT_AUTH.SAVE_TOKEN_LOGIN)
  async saveLoginToken(payload: TokenLoginDto) {
    return await this.userService.saveTokenLogin(payload);
  }

  @OnEvent(EVENT_REDIS.SAVE_TOKEN_LOGIN)
  async saveLoginTokenRedis(payload: TokenLoginDto) {
    return await this.userService.saveTokenLoginRedis(payload);
  }
}
