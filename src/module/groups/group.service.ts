import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigData } from 'src/shared/base';
import { RedisService } from 'src/shared/redis';
import { Repository } from 'typeorm';
import { User } from '../users';
import { GroupRegisterDto } from './dtos';
import { Group } from './entites';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);
  private userId: string;
  constructor(
    private readonly configData: ConfigData,
    private readonly redisService: RedisService,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    this.redisService.getValue('userId').then((userId) => {
      this.userId = userId;
    });
  }

  async register(body: GroupRegisterDto) {
    return body;
  }
}
