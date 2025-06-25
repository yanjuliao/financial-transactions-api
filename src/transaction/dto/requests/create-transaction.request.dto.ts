import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsEnum } from 'class-validator';

export class CreateTransactionRequestDto {
  @ApiProperty({ example: '2025-06-25T13:00:00Z', description: 'Data da transação' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 100.0, description: 'Valor da transação' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'ENTRADA', enum: ['ENTRADA', 'SAIDA'], description: 'Tipo da transação' })
  @IsEnum(['ENTRADA', 'SAIDA'])
  type: 'ENTRADA' | 'SAIDA';

  @ApiProperty({ example: 1, description: 'ID da categoria associada' })
  @IsNumber()
  categoryId: number;
}
