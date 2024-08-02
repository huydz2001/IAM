import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permision } from './entites/permision.entity';
import { PermisionController } from './permision.controller';
import { PermisionService } from './permision.service';
import { ConfigData } from 'src/shared/base';
import { MenuService } from '../menu/menu.service';
import { Modules } from '../menu/entity/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permision, Modules])],
  controllers: [PermisionController],
  exports: [PermisionService],
  providers: [PermisionService, ConfigData, MenuService],
})
export class PermisionModule {}
