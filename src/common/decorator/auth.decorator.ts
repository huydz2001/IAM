import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guard/admin.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const AdminAuth = () =>
  applyDecorators(UseGuards(AdminGuard), ApiBearerAuth());
