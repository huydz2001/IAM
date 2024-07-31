import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoginToken } from './entities/login-token.entity';
import { Profile } from './entities/profile.entity';
import { ConfigData } from 'src/shared/base';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, LoginToken, Profile])],
  exports: [UserService],
  providers: [UserService, ConfigData],
  controllers: [UserController],
})
export class UserModule {}
