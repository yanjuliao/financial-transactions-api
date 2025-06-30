import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Afonso', description: 'Nome do Usuário' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'afonso@gmail.com', description: 'Email do Usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'sdyfgs', description: 'Senha do Usuário' })
  @MinLength(6)
  senha: string;
}
