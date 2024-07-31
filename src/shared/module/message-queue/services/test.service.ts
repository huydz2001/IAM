import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import config from 'src/config';
import { RoutingKey } from 'src/constant';

@Injectable()
export class TestService {
  private readonly logger = new Logger(TestService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async loginGuestClient(payload: any) {
    try {
      return this.amqpConnection.request<any>({
        exchange: config.rabbitmq.exchange,
        routingKey: RoutingKey.AUTH.LOGIN_GUEST,
        payload: payload,
        timeout: 10000,
      });
    } catch (err) {
      this.logger.error(err?.message);
      throw err;
    }
  }

  async login(payload: any) {
    try {
      return this.amqpConnection.request<any>({
        exchange: config.rabbitmq.exchange,
        routingKey: RoutingKey.AUTH.LOGIN,
        payload: payload,
        timeout: 10000,
      });
    } catch (err) {
      this.logger.error(err?.message);
      throw err;
    }
  }
}
