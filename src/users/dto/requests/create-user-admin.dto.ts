import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserAdminDto {
  @ApiProperty({ example: 'Afonso', description: 'Name User' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'afonso@gmail.com', description: 'Email User' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'sdyfgs', description: 'Password User' })
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'USER', enum: ['ADMIN', 'USER'] })
  @IsEnum(['ADMIN', 'USER'])
  role: 'ADMIN' | 'USER';
}
