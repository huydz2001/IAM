import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ID_ADMIN } from 'src/constant';
import { ConfigData } from 'src/shared/base';
import { RedisService } from 'src/shared/redis';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { ModuleCreateDto } from './dto/module-create.dto';
import { Modules } from './entity/module.entity';

@Injectable()
export class MenuService {
  private userId: string;
  private logger = new Logger(MenuService.name);

  constructor(
    @InjectRepository(Modules) private readonly moduleRepo: Repository<Modules>,
    private readonly redisService: RedisService,
    private readonly configData: ConfigData,
    @InjectDataSource() private readonly entityManager: EntityManager,
  ) {
    this.redisService.getValue('userId').then((userId) => {
      if (userId) {
        this.userId = userId;
      } else {
        this.userId = ID_ADMIN;
      }
    });
  }

  async create(payload: ModuleCreateDto) {
    const { name, desc, parentId } = payload;
    return await this.entityManager
      .transaction(async (manager: EntityManager) => {
        let parentModule: Modules;

        let module = new Modules({
          name: name,
          desc: desc,
          parentId: parentId,
        });

        if (parentId) {
          parentModule = await this.moduleRepo.findOne({
            where: { id: parentId },
          });

          if (!parentModule) {
            throw new NotFoundException('Parent module not found');
          }

          module = this.configData.createData(module, this.userId);
          await manager.getRepository(Modules).save(module);
        } else {
          module = this.configData.createData(module, this.userId);
          await this.entityManager.getRepository(Modules).save(module);
        }
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw err;
      });
  }

  async getMenu() {
    const modules = await this.moduleRepo.find({
      where: {
        parentId: IsNull(),
      },
      select: {
        id: true,
        desc: true,
        name: true,
        parentId: true,
      },
    });

    await Promise.all(
      modules.map(async (item) => {
        item.subModules = await this.moduleRepo.find({
          where: { parentId: item.id },
          relations: {
            permisions: true,
          },
          select: {
            id: true,
            name: true,
            desc: true,
            parentId: true,
            permisions: {
              id: true,
              type: true,
              desc: true,
              moduleId: true,
            },
          },
        });
      }),
    );

    return modules;
  }

  async findById(id: string) {
    return await this.moduleRepo.findOne({ where: { id } });
  }
}
