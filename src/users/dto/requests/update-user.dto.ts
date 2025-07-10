import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Afonso', description: 'Name User' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'afonso@gmail.com', description: 'Email User' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'sdyfgs', description: 'Password User' })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'USER', enum: ['ADMIN', 'USER'] })
  @IsEnum(['ADMIN', 'USER'])
  role?: 'ADMIN' | 'USER';
}
