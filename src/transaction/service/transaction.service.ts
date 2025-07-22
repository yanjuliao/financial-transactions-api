import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/library";
import { CreateTransactionRequestDto } from "../dto/requests/create-transaction.request.dto";
import { FilterByPeriodRequestDto } from "../dto/requests/filter-by-period.request.dto";
import { UpdateTransactionRequestDto } from "../dto/requests/update-transaction.request.dto";
import { BalanceResponseDto } from "../dto/response/balance.response.dto";
import { MessageResponseDto } from "../dto/response/message.response.dto";
import { TransactionResponseDto } from "../dto/response/transaction.response.dto";
import { isCategoryValidForType } from "../enum";
import { TransactionMapper } from "../mapper/transaction.mapper";
import { TransactionRepository } from "../repository/transaction.repository";

@Injectable()
export class TransactionService {
  private TRANSACTION_NOT_FOUND_MESSAGE = 'transaction_not_found';
  private TRANSACTION_CREATED_MESSAGE = 'transaction_created_successfully';
  private CATEGORY_VALIDATION_BY_TYPE_MESSAGE =
    'invalid_category_for_the_specified_type.';
  private NOT_INFORMED_TYPE_OR_CATEGORY_MESSAGE = 'type_or_category_not_informated.';

  constructor(
    private readonly repository: TransactionRepository
  ) {}

  async getAllTransactions(userId: number): Promise<TransactionResponseDto[]> {
    const result = await this.repository.findAllTransactions(userId);
    return TransactionMapper.toResponseDtoList(result);
  }

  async getTransactionById(
    transactionId: number,
    userId: number,
  ): Promise<TransactionResponseDto> {
    const result = await this.repository.findTransactionById(transactionId, userId);
    if (!result) {
      throw new NotFoundException(this.TRANSACTION_NOT_FOUND_MESSAGE);
    }
    return TransactionMapper.toResponseDto(result);
  }

  async getTransactionsByPeriod(
    dto: FilterByPeriodRequestDto,
    userId: number,
  ): Promise<TransactionResponseDto[]> {
    const result = await this.repository.findTransactionsByPeriod(
      userId,
      dto.startDate,
      dto.endDate,
    );

    return TransactionMapper.toResponseDtoList(result);
  }

  async getBalanceByPeriod(
    dto: FilterByPeriodRequestDto,
    userId: number,
  ): Promise<BalanceResponseDto> {
    const transactions = await this.repository.findTransactionsByPeriod(
      userId,
      dto.startDate,
      dto.endDate,
    );

    const entradas = transactions
      .filter((t) => t.type === 'ENTRADA')
      .reduce((sum, t) => sum.plus(t.price), new Decimal(0));

    const saidas = transactions
      .filter((t) => t.type === 'SAIDA')
      .reduce((sum, t) => sum.plus(t.price), new Decimal(0));

    const saldo = entradas.minus(saidas);
    return { saldo: saldo.toNumber() };
  }

  async createTransaction(
    dto: CreateTransactionRequestDto,
    userId: number,
  ): Promise<TransactionResponseDto> {
    if (!isCategoryValidForType(dto.type, dto.category)) {
      throw new BadRequestException(this.CATEGORY_VALIDATION_BY_TYPE_MESSAGE);
    }

    const data = TransactionMapper.toEntity(userId, { ...dto });
    const saved = await this.repository.createTransaction(data);
    return TransactionMapper.toResponseDto(saved);
  }

  async createTransactionsMany(
    dtos: CreateTransactionRequestDto[],
    userId: number,
  ): Promise<MessageResponseDto> {
    for (const dto of dtos) {
      if (!isCategoryValidForType(dto.type, dto.category)) {
        throw new BadRequestException(
          `${this.CATEGORY_VALIDATION_BY_TYPE_MESSAGE} Type: ${dto.type}, Category: ${dto.category}`,
        );
      }
    }

    const entities = dtos.map((dto) =>
      TransactionMapper.toEntity(userId,{ ...dto }),
    );
    await this.repository.createTransactionsMany(entities);
    return { message: this.TRANSACTION_CREATED_MESSAGE };
  }

  async updateTransaction(
    transactionId: number,
    dto: UpdateTransactionRequestDto,
    userId: number,
  ): Promise<TransactionResponseDto> {
    const transaction =
      await this.repository.findTransactionById(transactionId, userId);
    if (!transaction) throw new NotFoundException(this.TRANSACTION_NOT_FOUND_MESSAGE);

    if (!dto.type || !dto.category) {
      throw new BadRequestException(this.NOT_INFORMED_TYPE_OR_CATEGORY_MESSAGE);
    }

    if (!isCategoryValidForType(dto.type, dto.category)) {
      throw new BadRequestException(this.CATEGORY_VALIDATION_BY_TYPE_MESSAGE);
    }

    const updated = await this.repository.updateTransaction(
      transactionId,
      userId,
      dto,
    );
    return TransactionMapper.toResponseDto(updated);
  }

  async deleteTransaction(transactionId: number, userId: number): Promise<void> {
    const found = await this.repository.findTransactionById(transactionId, userId);
    if (!found) {
      throw new NotFoundException(this.TRANSACTION_NOT_FOUND_MESSAGE);
    }

    await this.repository.deleteTransaction(transactionId, userId);
  }

  async hasUserTransactions(userId: number): Promise<boolean> {
    return this.repository.findAnyByUserId(userId);
  }
}
