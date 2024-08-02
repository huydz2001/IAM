import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TYPE_ACTION } from 'src/constant';

export class PermisionCreateDto {
  @ApiProperty({
    enum: TYPE_ACTION,
  })
  @IsNotEmpty()
  type: number;

  @ApiPropertyOptional()
  @IsString()
  desc: string;

  @IsString()
  @IsNotEmpty()
  moduleId: string;
}
