import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ID_ADMIN } from 'src/constant';
import { RedisService } from 'src/shared/redis';
import { PermisionCreateDto } from './dtos/permision-create.dto';
import { ConfigData } from 'src/shared/base';
import { InjectRepository } from '@nestjs/typeorm';
import { Permision } from './entites/permision.entity';
import { Repository } from 'typeorm';
import { MenuService } from '../menu/menu.service';

@Injectable()
export class PermisionService {
  private userId: string;
  private logger = new Logger(PermisionService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly menuService: MenuService,
    private configData: ConfigData,
    @InjectRepository(Permision)
    private readonly permisionRepo: Repository<Permision>,
  ) {
    this.redisService.getValue('userId').then((userId) => {
      if (userId) {
        this.userId = userId;
      } else {
        this.userId = ID_ADMIN;
      }
    });
  }

  async create(payload: PermisionCreateDto) {
    const { type, desc, moduleId } = payload;

    let permision = new Permision({
      type: type,
      desc: desc,
    });

    try {
      const module = await this.menuService.findById(moduleId);
      if (!module) {
        throw new NotFoundException('Module not found!');
      }

      permision = this.configData.createData(permision, this.userId);
      permision.module = module;
      await this.permisionRepo.save(permision);

      return {
        id: permision.id,
        type: type,
        desc: desc,
      };
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  async delete(payload: any) {
    const { permisionId } = payload;

    try {
      const permision = await this.permisionRepo.findOne({
        where: { id: permisionId },
      });

      if (!permision) {
        throw new NotFoundException('Permision not found!');
      }

      await this.permisionRepo.delete(permision);

      return {
        message: 'Delete permision success',
      };
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }
}
