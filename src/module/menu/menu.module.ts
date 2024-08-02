import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modules } from './entity/module.entity';
import { Permision } from '../permisions';
import { MenuService } from './menu.service';
import { ConfigData } from 'src/shared/base';
import { MenuController } from './menu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Modules, Permision])],
  providers: [MenuService, ConfigData],
  exports: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
