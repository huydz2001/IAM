import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  // @IsString()
  // @IsNotEmpty()
  @ApiProperty()
  ipAdress: string;
}

export class LoginGuestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phone: string;
}
