import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoginToken } from './entities/login-token.entity';
import { Profile } from './entities/profile.entity';
import { ConfigData } from 'src/shared/base';
import { UserController } from './user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, LoginToken, Profile]), JwtModule],
  exports: [UserService],
  providers: [UserService, ConfigData, JwtService],
  controllers: [UserController],
})
export class UserModule {}
