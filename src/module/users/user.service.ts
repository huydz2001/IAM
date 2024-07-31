import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ID_ADMIN } from 'src/constant';
import { ConfigData } from 'src/shared/base';
import { RedisService } from 'src/shared/redis';
import { EntityManager, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { TokenLoginDto } from './dtos';
import { LoginToken } from './entities/login-token.entity';
import {
  decodeJwtToken,
  getDurationExpired,
  getDurationExpiredRT,
} from 'src/util/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private userId: string;

  constructor(
    @InjectDataSource() private readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(LoginToken)
    private readonly loginTokenRepo: Repository<LoginToken>,

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

  async findUserByPhone(phone: string) {
    return await this.userRepo.findOne({ where: { phone: phone } });
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

  async saveTokenLogin(payload: TokenLoginDto) {
    const { accessToken, refreshToken, user, ipAdress } = payload;
    try {
      return await this.loginTokenRepo.upsert(
        {
          id: uuidv4(),
          accessToken: accessToken,
          refreshToken: refreshToken,
          ip_adress: ipAdress,
          user: user,
          created_at: new Date(),
          updated_at: new Date(),
        },
        ['user_id'],
      );
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async saveTokenLoginRedis(payload: TokenLoginDto) {
    const { accessToken, user, refreshToken } = payload;
    const decodeToken = decodeJwtToken(accessToken);
    const decodeRefreshToken = decodeJwtToken(refreshToken);
    const expiredTimeAT = getDurationExpired(decodeToken?.exp);
    const expiredTimeRT = getDurationExpiredRT(decodeRefreshToken?.exp);

    await this.redisService.setValue(
      `accessToken:${user.id}`,
      accessToken,
      expiredTimeAT,
    );

    await this.redisService.setValue(
      `refreshToken:${user.id}`,
      accessToken,
      expiredTimeRT,
    );
  }
}
