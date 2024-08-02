import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import * as compression from 'compression';
import helmet from 'helmet';
import config from './config';
import { configuration } from './config/configuration';
import { DatabaseModule } from './database';
import { AuthModule } from './module/auth/auth.module';
import { GroupModule } from './module/groups/group.module';
import { UserModule } from './module/users/user.module';
import { LoggerMiddleware } from './shared/loggers';
import { MessageQueueModule } from './shared/module';
import { RedisModule } from './shared/redis';
import { MenuModule } from './module/menu/menu.module';
import { PermisionModule } from './module/permisions/permision.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.key'),
        signOptions: {
          expiresIn: configService.get('jwt.KeyExpired'),
        },
      }),
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
    UserModule,
    MenuModule,
    PermisionModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes('*');
    consumer.apply(compression()).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
