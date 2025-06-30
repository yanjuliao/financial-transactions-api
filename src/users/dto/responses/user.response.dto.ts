import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserResponseDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  senha: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
