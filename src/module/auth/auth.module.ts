import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigData } from 'src/shared/base';
import { AuthFactory } from './auth.factory';
import { UserService } from '../users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [ConfigData, AuthService, AuthFactory, UserService],
})
export class AuthModule {}
