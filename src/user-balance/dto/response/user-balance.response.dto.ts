import { ApiProperty } from '@nestjs/swagger';

export class UserBalanceResponseDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: '2025-07-25T00:00:00.000Z' })
  snapshotDate: Date;

  @ApiProperty({ example: 1530.75 })
  balance: number;
}