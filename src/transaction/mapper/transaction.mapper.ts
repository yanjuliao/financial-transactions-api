import { Category, Transaction as PrismaTransaction } from '@prisma/client';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';
import { CreateTransactionRequestDto } from '../dto/requests/create-transaction.request.dto';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionMapper {
  static toEntity(userId: number, dto: CreateTransactionRequestDto): {
    date: Date;
    price: number;
    type: 'ENTRADA' | 'SAIDA';
    userId: number;
    category: Category;
  } {
    return {
      date: new Date(dto.date),
      price: Number(dto.price), 
      type: dto.type,
      userId: userId,
      category: dto.category
    };
  }
  static toResponseDto(
    model: PrismaTransaction 
  ): TransactionResponseDto {
    return {
      transactionId: model.transactionId,
      date: model.date,
      price: Number(model.price),
      type: model.type,
      category: model.category,
      userId: model.userId,
    };
  }

  static toResponseDtoList(
    models: (PrismaTransaction)[],
  ): TransactionResponseDto[] {
    return models.map(this.toResponseDto);
  }
}
