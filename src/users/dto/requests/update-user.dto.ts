import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Afonso', description: 'Name User' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'sdyfgs', description: 'Password User' })
  @IsOptional()
  @MinLength(6)
  password?: string;
}
