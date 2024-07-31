import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import config from 'src/config';
import { TestService } from './services/test.service';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: config.rabbitmq.exchange,
          type: 'topic',
          options: { autoDelete: true },
        },
      ],
      uri: config.rabbitmq.uri,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [TestService],
  exports: [TestService],
})
export class MessageQueueModule {}
