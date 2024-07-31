import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import * as ms from 'ms';
import config from 'src/config';
import { ID_ADMIN, RoutingKey } from 'src/constant';
import { EVENT_AUTH, EVENT_REDIS } from 'src/constant/event-emitter.constant';
import { ConfigData } from 'src/shared/base';
import { TestService } from 'src/shared/module';
import { RedisService } from 'src/shared/redis';
import { randomQueueName } from 'src/util/common';
import { User } from '../users';
import { TokenLoginDto } from '../users/dtos';
import { UserService } from '../users/user.service';
import { AuthFactory } from './auth.factory';
import { LoginDto, LoginGuestDto } from './dtos/login.dto';
import { UserRegisterDto } from './dtos/user-register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private userId: string;

  constructor(
    private readonly userService: UserService,
    private readonly configData: ConfigData,
    private readonly redisService: RedisService,
    private readonly authFactory: AuthFactory,
    private readonly configService: ConfigService,
    private readonly testService: TestService,
    private readonly jwtService: JwtService,
    private readonly evenEmitter: EventEmitter2,
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

  async registerClient(payload: UserRegisterDto) {
    try {
      const resp = await this.testService.loginGuestClient(payload);
      if (resp?.data.messageResp) {
        throw new BadRequestException(resp.data.messageResp);
      }
      return resp?.data ?? null;
    } catch (err) {
      this.logger.error(err?.message);
      throw err;
    }
  }

  async loginGuestClient(payload: LoginGuestDto) {
    try {
      const resp = await this.testService.loginGuestClient(payload);
      if (resp?.data.messageResp) {
        throw new BadRequestException(resp.data.messageResp);
      }
      return resp.data ?? null;
    } catch (err) {
      this.logger.error(err?.message);
      throw err;
    }
  }

  async loginClient(payload: LoginDto) {
    try {
      const resp = await this.testService.login(payload);
      if (resp?.data.messageResp) {
        throw new BadRequestException(resp.data.messageResp);
      }
      return resp.data ?? null;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @RabbitRPC({
    exchange: config.rabbitmq.exchange,
    routingKey: RoutingKey.AUTH.LOGIN,
    queue: randomQueueName(),
    queueOptions: { autoDelete: true },
  })
  private async login(payload: LoginDto) {
    const { phone, password, ipAdress } = payload;

    const user = await this.userService.findUserByPhone(phone);
    if (!user || user.hash_pass !== this.authFactory.hashPassword(password)) {
      return {
        messageResp: 'Wrong phone or password!',
      };
    }

    const token = this.generateToken(user);
    const payloadSaveToken: TokenLoginDto = {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      user: user,
      ipAdress: ipAdress,
    };

    this.evenEmitter.emit(EVENT_AUTH.SAVE_TOKEN_LOGIN, payloadSaveToken);
    this.evenEmitter.emit(EVENT_REDIS.SAVE_TOKEN_LOGIN, payloadSaveToken);
    return token;
  }

  @RabbitRPC({
    exchange: config.rabbitmq.exchange,
    queue: randomQueueName(),
    routingKey: RoutingKey.AUTH.LOGIN_GUEST,
    queueOptions: { autoDelete: true },
  })
  private async loginGuest(payload: LoginGuestDto) {
    this.logger.debug(payload);
  }

  private generateToken(user: User) {
    const jwt = this.configService.get('jwt');
    const payloadJwt = {
      id: user.id,
    };

    const accessToken: string = this.jwtService.sign(payloadJwt, {
      secret: jwt.key,
      expiresIn: jwt.keyExpired,
    });
    const expiredTime: number = this.expiredDay(jwt.keyExpired);
    const refreshToken: string = this.jwtService.sign(payloadJwt, {
      secret: jwt.keyRefresh,
      expiresIn: jwt.keyRefreshExpired,
    });

    return {
      accessToken,
      expiredTime,
      refreshToken,
    };
  }

  private expiredDay(expires: string): number {
    return new Date().getTime() + Number(ms(expires));
  }
}
