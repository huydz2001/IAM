import { IamMessageEvent } from 'src/constant/redis.constant';

export class DataMessageQueue {
  event: IamMessageEvent;
  data?: any;
}
