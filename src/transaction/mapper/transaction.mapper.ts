import { Transaction as PrismaTransaction } from '@prisma/client';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';
import { CreateTransactionRequestDto } from '../dto/requests/create-transaction.request.dto';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionMapper {
  static toEntity(dto: CreateTransactionRequestDto): {
    date: Date;
    price: number;
    type: 'ENTRADA' | 'SAIDA';
    categoryId: number;
  } {
    return {
      date: new Date(dto.date),
      price: Number(dto.price), 
      type: dto.type,
      categoryId: dto.categoryId,
    };
  }
  static toResponseDto(
    model: PrismaTransaction & {
      category: { categoryId: number; name: string };
    },
  ): TransactionResponseDto {
    return {
      transactionId: model.transactionId,
      date: model.date,
      price: Number(model.price),
      type: model.type,
      category: {
        categoryId: model.category.categoryId,
        name: model.category.name,
      },
    };
  }

  static toResponseDtoList(
    models: (PrismaTransaction & {
      category: { categoryId: number; name: string };
    })[],
  ): TransactionResponseDto[] {
    return models.map(this.toResponseDto);
  }
}
