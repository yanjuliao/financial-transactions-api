import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class FilterByPeriodRequestDto {
  @ApiProperty({ example: '2025-06-01T00:00:00Z', description: 'Data de início do período' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2025-06-30T23:59:59Z', description: 'Data de fim do período' })
  @IsDateString()
  endDate: Date;
}