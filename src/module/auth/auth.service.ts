import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigData } from 'src/shared/base';
import { RedisService } from 'src/shared/redis';
import { UserService } from '../users/user.service';
import { AuthFactory } from './auth.factory';
import { UserRegisterDto } from './dtos/user-register.dto';
import { ID_ADMIN } from 'src/constant';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private userId: string;

  constructor(
    private readonly userService: UserService,
    private readonly configData: ConfigData,
    private readonly redisService: RedisService,
    private readonly authFactory: AuthFactory,
  ) {
    this.redisService.getValue('userId').then((userId) => {
      if (userId) {
        this.userId = userId;
      } else {
        this.userId = ID_ADMIN;
      }
    });
  }

  async register(payload: UserRegisterDto) {
    try {
      const user = await this.userService.findUserByEmail(payload.email);

      if (user) {
        throw new BadRequestException('Email has already exist!');
      }

      let nUser = this.authFactory.ConvertUserRegisterDtoToEntity(payload);
      nUser = this.configData.createData(nUser, this.userId);

      this.logger.log(nUser);
      const resp = await this.userService.saveUserRegister(nUser, payload.name);
      this.logger.log(resp);
      return {
        message: 'Register user success',
      };
    } catch (err) {
      this.logger.error(err?.message);
      throw err;
    }
  }
}
