import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  test = async (req: any) => {
    const user = await this.userRepo.find({ where: { id: req.id } });
    return user;
  };
}
