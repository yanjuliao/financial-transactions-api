import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsEnum } from 'class-validator';
import { Category, TransactionType } from 'src/transaction/enum';

export class UpdateTransactionRequestDto {
  @ApiPropertyOptional({ example: '2025-06-25T13:00:00Z' })
  @IsDateString()
  date?: Date;

  @ApiPropertyOptional({ example: 100.0 })
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 'ENTRADA', enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({ example: 'TRANSPORTE', enum: Category })
  @IsEnum(Category)
  category: Category;
}
