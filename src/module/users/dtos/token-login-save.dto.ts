import { User } from '../entities/user.entity';

export class TokenLoginDto {
  accessToken: string;
  refreshToken: string;
  user: User;
  ipAdress: string;
}
