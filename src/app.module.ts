import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import * as compression from 'compression';
import helmet from 'helmet';
import config from './config';
import { configuration } from './config/configuration';
import { DatabaseModule } from './database';
import { LoggerMiddleware } from './shared/loggers';
import { MessageQueueModule } from './shared/module';
import { RedisModule } from './shared/redis';
import { GroupModule } from './module/groups/group.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    BullModule.forRoot({
      redis: {
        host: config.redis.host,
        port: Number(config.redis.port),
        password: config.redis.password,
      },
    }),
    BullBoardModule.forRoot({ route: '/queues', adapter: ExpressAdapter }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    MessageQueueModule,
    RedisModule,
    GroupModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes('*');
    consumer.apply(compression()).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
