import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { DatabaseModule } from './database';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
