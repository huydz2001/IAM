import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '.';
import { Role } from '../roles';
import { GroupService } from './group.service';
import { ConfigData } from 'src/shared/base';
import { GroupController } from './group.controller';
import { User } from '../users';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Role, User])],
  providers: [GroupService, ConfigData],
  exports: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
