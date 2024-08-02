import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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
import { decodeJwtToken, randomQueueName } from 'src/util/common';
import { User } from '../users';
import { TokenLoginDto } from '../users/dtos';
import { UserService } from '../users/user.service';
import { AuthFactory } from './auth.factory';
import { LoginDto, LoginGuestDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/token-refresh.dto';
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
      if (resp?.data?.messageResp) {
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
      if (resp?.data?.messageResp) {
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
      const resp = await this.testService.loginClient(payload);
      if (resp?.data?.messageResp) {
        throw new BadRequestException(resp.data.messageResp);
      }
      return resp.data ?? null;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async refreshTokenClient(payload: RefreshTokenDto, ipAdress: string) {
    try {
      const resp = await this.testService.refreshTokenClient(payload, ipAdress);
      if (resp?.data?.messageResp) {
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

    try {
      const user = await this.userService.findUserByPhone(phone);
      if (!user || user.hash_pass !== this.authFactory.hashPassword(password)) {
        throw new BadRequestException('Wrong phone or password!');
      }

      const token = this.generateToken(user);
      const payloadSaveToken: TokenLoginDto = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        userId: user.id,
        ipAdress: ipAdress,
      };

      this.evenEmitter.emit(EVENT_AUTH.SAVE_TOKEN_LOGIN, payloadSaveToken);
      this.evenEmitter.emit(EVENT_REDIS.SAVE_TOKEN_LOGIN, payloadSaveToken);
      return token;
    } catch (err) {
      this.logger.error(err.message);
      return {
        messageResp: err.message,
      };
    }
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

  @RabbitRPC({
    exchange: config.rabbitmq.exchange,
    queue: randomQueueName(),
    routingKey: RoutingKey.AUTH.REFRESH_TOKEN,
    queueOptions: { autoDelete: true },
  })
  private async refreshToken(payload: any) {
    const { accessToken, refreshToken, ipAddress } = payload;
    try {
      const decodeToken = decodeJwtToken(accessToken);
      const decodeRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_KEY_REFRESH'),
      });

      if (!decodeToken || !decodeRefreshToken) {
        throw new UnauthorizedException();
      }

      const userId = decodeToken?.id;
      const userLoginToken = await this.userService.getUserLoginToken(userId);

      if (userLoginToken.ip_adress !== ipAddress) {
        // TODO
        // Send OTP confirm
      }

      if (userId !== decodeRefreshToken.id || !userLoginToken) {
        throw new UnauthorizedException();
      }

      if (
        userLoginToken.access_token !== accessToken ||
        userLoginToken.refresh_token !== refreshToken
      ) {
        throw new UnauthorizedException();
      }

      const jwt = this.configService.get('jwt');
      const newToken = this.jwtService.sign(
        { id: userId },
        {
          secret: jwt.key,
          expiresIn: jwt.keyExpired,
        },
      );
      const newRefreshToken = this.jwtService.sign(
        { id: userId },
        {
          secret: jwt.keyRefresh,
          expiresIn: jwt.keyRefreshExpired,
        },
      );

      userLoginToken.access_token = newToken;
      userLoginToken.refresh_token = newRefreshToken;
      await this.userService.updateLoginToken(userLoginToken);

      const payloadSaveToken: TokenLoginDto = {
        accessToken: newToken,
        refreshToken: newRefreshToken,
        userId: userId,
        ipAdress: ipAddress,
      };

      this.evenEmitter.emit(EVENT_REDIS.SAVE_TOKEN_LOGIN, payloadSaveToken);

      return {
        accessToken: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      this.logger.error(err.message);
      return {
        messageResp: err.message,
      };
    }
  }

  private generateToken(user: User) {
    console.log(user);
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
