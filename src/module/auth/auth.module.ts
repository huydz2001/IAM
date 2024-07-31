import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigData } from 'src/shared/base';
import { LoginToken, User } from '../users';
import { UserService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { AuthFactory } from './auth.factory';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, LoginToken]), JwtModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [ConfigData, AuthService, AuthFactory, UserService, JwtService],
})
export class AuthModule {}
