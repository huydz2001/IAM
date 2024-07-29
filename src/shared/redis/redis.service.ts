import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { InjectEntityManager } from '@nestjs/typeorm';
import 'dotenv/config';
import Redis from 'ioredis';
import { PROVIDERS } from 'src/constant';
import { EntityManager } from 'typeorm';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

@Injectable()
export class RedisService implements OnModuleInit {
  private logger = new Logger(RedisService.name);

  @Client({
    transport: Transport.REDIS,
    options: {
      host: REDIS_HOST,
      port: Number(REDIS_PORT) || 6363,
      password: REDIS_PASSWORD,
    },
  })
  private readonly client: ClientProxy;

  private readonly redisClient: Redis;

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
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('🚀️ ~ Connected Iam redis');
    } catch (error) {
      console.log('🛑️ ~ Errors [init connect Iam redis]', error);
    }
  }

  getRedisClient() {
    return this.redisClient;
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

  // ===========func============
}
