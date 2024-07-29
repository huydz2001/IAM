import { Injectable } from '@nestjs/common';
import { User } from '../users';
import { UserRegisterDto } from './dtos/user-register.dto';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthFactory {
  ConvertUserRegisterDtoToEntity(dto: UserRegisterDto): User {
    return {
      id: uuidv4(),
      email: dto.email,
      phone: dto.phone,
      profile: null,
      active: true,
      hash_pass: this.hashPassword(dto.password),
      updated_by: null,
      created_at: null,
      is_verify_email: false,
      ip_address: null,
      group: null,
      roles: null,
      modified_at: null,
      isDeleted: null,
      created_by: null,
      deleted_by: null,
    };
  }

  private hashPassword(password: string) {
    return crypto.createHmac('sha256', password).digest('hex');
  }
}
