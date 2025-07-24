import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateTransactionRequestDto } from '../dto/requests/create-transaction.request.dto';
import { FilterByPeriodRequestDto } from '../dto/requests/filter-by-period.request.dto';
import { UpdateTransactionRequestDto } from '../dto/requests/update-transaction.request.dto';
import { BalanceResponseDto } from '../dto/response/balance.response.dto';
import { MessageResponseDto } from '../dto/response/message.response.dto';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';
import { CategoryType, TransactionType, isCategoryValidForType } from '../enum';
import { TransactionMapper } from '../mapper/transaction.mapper';
import { TransactionRepository } from '../repository/transaction.repository';
import { Category, Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  private readonly TRANSACTION_NOT_FOUND_MESSAGE = 'transaction_not_found';
  private readonly TRANSACTION_CREATED_MESSAGE =
    'transaction_created_successfully';
  private readonly CATEGORY_VALIDATION_BY_TYPE_MESSAGE =
    'invalid_category_for_the_specified_type';
  private readonly NOT_PROVIDED_TYPE_OR_CATEGORY_MESSAGE =
    'type_or_category_not_provided';

  constructor(private readonly repository: TransactionRepository) {}

  async findAllTransactions(userId: number): Promise<TransactionResponseDto[]> {
    const transactions = await this.repository.findAllTransactions(userId);
    return TransactionMapper.toResponseDtoList(transactions);
  }

  async findTransactionById(
    transactionId: number,
    userId: number,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.repository.findTransactionById(
      transactionId,
      userId,
    );
    if (!transaction) {
      throw new NotFoundException(this.TRANSACTION_NOT_FOUND_MESSAGE);
    }
    return TransactionMapper.toResponseDto(transaction);
  }

  async findTransactionsByPeriod(
    dto: FilterByPeriodRequestDto,
    userId: number,
  ): Promise<TransactionResponseDto[]> {
    const transactions = await this.repository.findTransactionsByPeriod(
      userId,
      dto.startDate,
      dto.endDate,
    );
    return TransactionMapper.toResponseDtoList(transactions);
  }

  async findBalanceByPeriod(
    dto: FilterByPeriodRequestDto,
    userId: number,
  ): Promise<BalanceResponseDto> {
    const transactions = await this.repository.findTransactionsByPeriod(
      userId,
      dto.startDate,
      dto.endDate,
    );
    return this.calculateBalance(transactions);
  }

  async createTransaction(
    dto: CreateTransactionRequestDto,
    userId: number,
  ): Promise<TransactionResponseDto> {
    this.validateCategoryForType(dto.type, dto.category);
    const entity = TransactionMapper.toEntity(userId, dto);
    const saved = await this.repository.createTransaction(entity);
    return TransactionMapper.toResponseDto(saved);
  }

  async createTransactionsMany(
    dtos: CreateTransactionRequestDto[],
    userId: number,
  ): Promise<MessageResponseDto> {
    for (const dto of dtos) {
      this.validateCategoryForType(dto.type, dto.category);
    }

    const entities = dtos.map((dto) => TransactionMapper.toEntity(userId, dto));
    await this.repository.createTransactionsMany(entities);

    return { message: this.TRANSACTION_CREATED_MESSAGE };
  }

  async updateTransaction(
    transactionId: number,
    dto: UpdateTransactionRequestDto,
    userId: number,
  ): Promise<TransactionResponseDto> {
    await this.findTransactionById(transactionId, userId);

    if (!dto.type || !dto.category) {
      throw new BadRequestException(this.NOT_PROVIDED_TYPE_OR_CATEGORY_MESSAGE);
    }

    this.validateCategoryForType(dto.type, dto.category);

    const updated = await this.repository.updateTransaction(
      transactionId,
      userId,
      dto,
    );
    return TransactionMapper.toResponseDto(updated);
  }

  async deleteTransaction(
    transactionId: number,
    userId: number,
  ): Promise<void> {
    await this.findTransactionById(transactionId, userId);
    await this.repository.deleteTransaction(transactionId, userId);
  }

  async hasUserTransactions(userId: number): Promise<boolean> {
    return this.repository.findAnyByUserId(userId);
  }

  private validateCategoryForType(
    type: TransactionType,
    category: CategoryType,
  ): void {
    if (!isCategoryValidForType(type, category)) {
      throw new BadRequestException(
        `${this.CATEGORY_VALIDATION_BY_TYPE_MESSAGE}. Type: ${type}, Category: ${category}`,
      );
    }
  }

  private calculateBalance(transactions: Transaction[]): BalanceResponseDto {
    const { entradas, saidas } = transactions.reduce(
      (acc, transaction) => {
        const value = new Decimal(transaction.price);
        if (transaction.type === 'ENTRADA') {
          acc.entradas = acc.entradas.plus(value);
        } else if (transaction.type === 'SAIDA') {
          acc.saidas = acc.saidas.plus(value);
        }
        return acc;
      },
      { entradas: new Decimal(0), saidas: new Decimal(0) },
    );

    return { saldo: entradas.minus(saidas).toNumber() };
  }
}
