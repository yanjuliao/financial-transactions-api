import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'user@email.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  password: string;
}