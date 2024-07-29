import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { ConfigData } from 'src/shared/base';
import { RedisService } from 'src/shared/redis';
import { v4 as uuidv4 } from 'uuid';
import { ID_ADMIN } from 'src/constant';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private userId: string;
  constructor(
    @InjectDataSource() private readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly configData: ConfigData,
    private readonly redisService: RedisService,
  ) {
    this.redisService.getValue('userId').then((userId) => {
      if (userId) {
        this.userId = userId;
      } else {
        this.userId = ID_ADMIN;
      }
    });
  }

  async findUserByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email: email } });
  }

  async saveUserRegister(
    entity: User,
    userName: string,
    profile?: Profile,
  ): Promise<User> {
    return await this.entityManager
      .transaction(async (manager: EntityManager) => {
        const user = await manager.getRepository(User).save(entity);

        let nProfile: Profile;
        if (!profile) {
          nProfile = new Profile({
            id: uuidv4(),
            user_name: userName,
            dob: null,
            full_name: null,
            gender: null,
            updated_by: null,
            created_at: null,
            created_by: null,
            modified_at: null,
          });
        } else {
          nProfile = profile;
        }
        nProfile.user = user;
        nProfile = this.configData.createData(nProfile, this.userId);
        await manager.getRepository(Profile).save(nProfile);

        return user;
      })
      .catch((err) => {
        console.log('🛑️ ~ Errors [saveUserRegister]', err);
        throw err;
      });
  }
}
