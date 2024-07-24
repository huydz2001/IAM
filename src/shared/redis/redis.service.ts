import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { InjectEntityManager } from '@nestjs/typeorm';
import 'dotenv/config';
import Redis from 'ioredis';
import { IamChannel, IamMessageEvent } from 'src/constant/redis.constant';
import { EntityManager } from 'typeorm';
import { DataMessageQueue } from './interfaces/message-queue.interface';
import { PROVIDERS } from 'src/constant';

const { REDIS_IAM_HOST, REDIS_IAM_PORT, REDIS_IAM_PASSWORD } = process.env;

@Injectable()
export class RedisService implements OnModuleInit {
  private logger = new Logger(RedisService.name);

  @Client({
    transport: Transport.REDIS,
    options: {
      host: REDIS_IAM_HOST,
      port: Number(REDIS_IAM_PORT) || 6363,
      password: REDIS_IAM_PASSWORD,
    },
  })
  private readonly client: ClientProxy;

  private readonly redisClient: Redis;
  private readonly redisIam: Redis;

  constructor(
    private readonly configService: ConfigService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Inject(PROVIDERS.REDIS_SERVICE)
    private clientRabbitmq: ClientProxy,
  ) {
    this.redisClient = new Redis({
      host: configService.get('redis.host'),
      port: Number(configService.get('redis.port')),
      password: configService.get('redis.password'),
    });

    this.redisIam = new Redis({
      host: configService.get('iamRedis.host'),
      port: +configService.get('iamRedis.port'),
      password: configService.get('iamRedis.password'),
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      await this.redisIam.subscribe(...Object.values(IamChannel));
      await this.subscribeToExternalEvents();
      console.log('🚀️ ~ Connected Iam redis');
    } catch (error) {
      console.log('🛑️ ~ Errors [init connect Iam redis]', error);
    }
  }

  /**
   * @WHAT :For pub/sub from redis 3rd
   */

  private async subscribeToExternalEvents() {
    this.redisIam.on(IamMessageEvent.MESSAGE, async (eventChannel, message) => {
      const dataParsed: DataMessageQueue = JSON.parse(message);
      switch (eventChannel) {
        case IamChannel.PACKAGE_SERVICE:
          if (dataParsed.event === IamMessageEvent.UPDATE_PACKAGE) {
            await this.processTransactionUpdateUserPackage(
              eventChannel,
              dataParsed.event,
              dataParsed.data,
            );
            return true;
          }

          this.logger.debug(
            `[Channel: ${eventChannel}]No event handle: ${dataParsed.event}`,
          );
          break;
        default:
          break;
      }
      return;
    });
  }

  getRedisIam() {
    return this.redisIam;
  }

  // ===================================
  /**
   * @WHAT :For internal redis (cache mem)
   */
  async setValue(
    key: string,
    value: string,
    expiredTime?: number,
  ): Promise<void> {
    await this.redisClient
      .set(key, value)
      .then(() => this.redisClient.expire(key, expiredTime));
  }

  async setExpired(key: string, expiredTime: number) {
    await this.redisClient.expire(key, expiredTime);
  }

  async getValue(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async delValue(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }

  async getTtlKey(key: string) {
    return await this.redisClient.ttl(key);
  }

  // ===========func==============
  async processTransactionUpdateUserPackage(
    eventChannel: IamChannel,
    eventMessage: IamMessageEvent,
    payload: any,
  ) {
    try {
      this.clientRabbitmq.emit('send_noti_updated_package', 'a');
      this.logger.debug(
        `🚀️ ~ [${eventChannel}-even:${eventMessage}] isdn:${payload?.isdn} saved log`,
      );
    } catch (error) {
      console.log(
        `[Channel: ${eventChannel}]🛑️ ~ Errors event: ${eventMessage}`,
        error,
      );
    }
  }
}
