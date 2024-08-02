import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { ConfigData } from 'src/shared/base';
import { LoginToken, User } from '../users';
import { UserService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { AuthFactory } from './auth.factory';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, LoginToken]),
    PassportModule.register({
      strategies: [{ name: 'jwt', strategy: JwtStrategy }],
    }),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [
    ConfigData,
    AuthService,
    AuthFactory,
    UserService,
    JwtStrategy,
    JwtService,
  ],
})
export class AuthModule {}
