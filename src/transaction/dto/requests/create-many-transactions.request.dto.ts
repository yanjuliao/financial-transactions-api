
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateTransactionRequestDto } from './create-transaction.request.dto';

export class CreateManyTransactionRequestDto {
  @ApiProperty({ type: [CreateTransactionRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionRequestDto)
  transactions: CreateTransactionRequestDto[];
}