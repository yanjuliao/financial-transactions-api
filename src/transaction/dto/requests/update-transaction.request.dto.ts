import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsEnum } from 'class-validator';

export class UpdateTransactionRequestDto {
  @ApiPropertyOptional({ example: '2025-06-25T13:00:00Z' })
  @IsDateString()
  date?: Date;

  @ApiPropertyOptional({ example: 100.0 })
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 'ENTRADA', enum: ['ENTRADA', 'SAIDA'] })
  @IsEnum(['ENTRADA', 'SAIDA'])
  type?: 'ENTRADA' | 'SAIDA';

  @ApiPropertyOptional({ example: 1, description: 'Category ID' })
  @IsNumber()
  categoryId?: number;
}
