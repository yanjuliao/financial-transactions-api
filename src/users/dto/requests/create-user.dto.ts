import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Afonso', description: 'Name User' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'afonso@gmail.com', description: 'Email User' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'sdyfgs', description: 'Password User' })
  @MinLength(6)
  password: string;

  @IsEnum(['ADMIN', 'USER'])
  role: 'ADMIN' | 'USER';
}
