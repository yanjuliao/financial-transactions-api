import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class FilterByPeriodRequestDto {
  @ApiProperty({ example: '2025-06-01T00:00:00Z', description: 'Start date of the period' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2025-06-30T23:59:59Z', description: 'End date of the period' })
  @IsDateString()
  endDate: Date;
}