import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class GroupRegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'group1' })
  groupName: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional()
  desc?: string;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  members?: string[];
}
