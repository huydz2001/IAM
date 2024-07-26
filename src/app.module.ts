import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import { configuration } from './config/configuration';
import { DatabaseModule } from './database';
import { UserModule } from './module/users/user.module';
import { LoggerMiddleware } from './shared/loggers';
import { MessageQueueModule } from './shared/module';
import { RedisModule } from './shared/redis';

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
    // LoggerModule,
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
