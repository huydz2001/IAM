import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { DatabaseModule } from './database';
import { MessageQueueModule } from './shared/module';
import { RedisModule } from './shared/redis';
import { UserModule } from './module/users/user.module';
import { LoggerMiddleware, LoggerModule } from './shared/loggers';
import helmet from 'helmet';
import * as compression from 'compression';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    MessageQueueModule,
    RedisModule,
    UserModule,
    LoggerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes('*');
    consumer.apply(compression()).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
