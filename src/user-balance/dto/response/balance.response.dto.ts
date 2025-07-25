import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BalanceResponseDto {
  @ApiProperty()
  @IsNumber()
  balance: number;
}
