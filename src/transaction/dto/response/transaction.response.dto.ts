import { ApiProperty } from '@nestjs/swagger';
import { Category, TransactionType } from '@prisma/client';



export class TransactionResponseDto {
  @ApiProperty()
  transactionId: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ enum: Category })
  category: Category;

  @ApiProperty()
  userId: number;
}
