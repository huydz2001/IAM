import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ModuleCreateDto } from './dto/module-create.dto';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: 'create module' })
  @Post('/create')
  async createModule(@Body() payload: ModuleCreateDto) {
    return await this.menuService.create(payload);
  }

  @Get('/')
  async getMenu() {
    return await this.menuService.getMenu();
  }
}
