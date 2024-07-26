import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'test api' })
  @Get('test/:id')
  async logout(@Param('id') id: string) {
    return await this.userService.test(id);
  }
}
