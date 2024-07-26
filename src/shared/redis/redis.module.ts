import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PROVIDERS } from 'src/constant';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [],
  providers: [
    RedisService,
    {
      provide: PROVIDERS.REDIS_SERVICE,
      useFactory: (configService: ConfigService) => {
        const rabbitmq = configService.get('rabbitmq');
        const rabbitmqUrl = `amqp://${rabbitmq.user}:${rabbitmq.password}@${rabbitmq.host}:${rabbitmq.port}`;
        const queueName = rabbitmq.queue;

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [rabbitmqUrl],
            queue: queueName,
            noAck: true,
            queueOptions: {
              durable: true,
              persistent: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
