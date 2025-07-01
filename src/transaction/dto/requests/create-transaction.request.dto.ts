import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsEnum } from 'class-validator';

export class CreateTransactionRequestDto {
  @ApiProperty({ example: '2025-06-25T13:00:00Z', description: 'Transaction date' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 100.0, description: 'Transaction price' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'ENTRADA', enum: ['ENTRADA', 'SAIDA'], description: 'Transaction type' })
  @IsEnum(['ENTRADA', 'SAIDA'])
  type: 'ENTRADA' | 'SAIDA';

  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsNumber()
  categoryId: number;
}
