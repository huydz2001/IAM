import { Body, Controller, Post } from '@nestjs/common';
import { PermisionService } from './permision.service';
import { PermisionCreateDto } from './dtos/permision-create.dto';

@Controller('permisions')
export class PermisionController {
  constructor(private readonly permisionService: PermisionService) {}

  @Post('/create')
  async create(@Body() payload: PermisionCreateDto) {
    return await this.permisionService.create(payload);
  }

  @Post('/delete')
  async delete(@Body() payload: any) {
    return await this.permisionService.delete(payload);
  }
}
