import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageResponseDto {
  @ApiProperty()
  @IsString()
  message: string;
}
