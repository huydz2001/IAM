import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ example: '0999999999' })
  phone: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  @ApiProperty({ example: 'abc123' })
  password: string;
}
