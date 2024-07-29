import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { GroupRegisterDto } from './dtos/group-register.dto';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: 'create group' })
  @Post('/create')
  async create(@Body() body: GroupRegisterDto) {
    return await this.groupService.register(body);
  }
}
