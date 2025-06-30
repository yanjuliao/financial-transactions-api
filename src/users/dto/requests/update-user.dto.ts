import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Afonso', description: 'Nome do Usuário' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'afonso@gmail.com', description: 'Email do Usuário' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'sdyfgs', description: 'Senha do Usuário' })
  @IsOptional()
  @MinLength(6)
  senha?: string;
}
