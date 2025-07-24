import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsEnum } from 'class-validator';
import { CategoryType, TransactionType } from 'src/transaction/enum';

export class CreateTransactionRequestDto {
  @ApiProperty({ example: '2025-06-25T13:00:00Z', description: 'Transaction date' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 100.0, description: 'Transaction price' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'ENTRADA', enum: TransactionType, description: 'Transaction type' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 'TRANSPORTE', enum: CategoryType, description: 'Category type' })
  @IsEnum(CategoryType)
  category: CategoryType;
}
