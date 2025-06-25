import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from 'src/category/dto/responses/category.response.dto';

export class TransactionResponseDto {
  @ApiProperty()
  transactionId: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: ['ENTRADA', 'SAIDA'] })
  type: 'ENTRADA' | 'SAIDA';

  @ApiProperty({
    type: () => CategoryResponseDto,
    description: 'Categoria associada à transação',
  })
  category: CategoryResponseDto;
}
