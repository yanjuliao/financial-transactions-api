import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../repository/transaction.repository';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionMapper } from '../mapper/transaction.mapper';
import { FilterByPeriodRequestDto } from '../dto/requests/filter-by-period.request.dto';
import { CreateTransactionRequestDto } from '../dto/requests/create-transaction.request.dto';
import { UpdateTransactionRequestDto } from '../dto/requests/update-transaction.request.dto';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';
import { BalanceResponseDto } from '../dto/response/balance.response.dto';
import { MessageResponseDto } from '../dto/response/message.response.dto';
import { CategoryService } from 'src/category/service/category.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async getAllTransactions(): Promise<TransactionResponseDto[]> {
    const result = await this.repository.findAllTransactions();
    return TransactionMapper.toResponseDtoList(result);
  }

  async getTransactionById(
    transactionId: number,
  ): Promise<TransactionResponseDto> {
    const result = await this.repository.findTransactionById(transactionId);
    if (!result) {
      throw new NotFoundException();
    }
    return TransactionMapper.toResponseDto(result);
  }

  async getTransactionsByPeriod(
    dto: FilterByPeriodRequestDto,
  ): Promise<TransactionResponseDto[]> {
    const result = await this.repository.findTransactionsByPeriod(
      dto.startDate,
      dto.endDate,
    );

    if (!result) {
      throw new NotFoundException();
    }

    return TransactionMapper.toResponseDtoList(result);
  }

  async getBalanceByPeriod(
    dto: FilterByPeriodRequestDto,
  ): Promise<BalanceResponseDto> {
    const transactions = await this.repository.findTransactionsByPeriod(
      dto.startDate,
      dto.endDate,
    );

    if (!transactions) {
      throw new NotFoundException();
    }

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
  ): Promise<TransactionResponseDto> {
    const category = await this.categoryService.getCategoryById(dto.categoryId);
    if (!category) {
      throw new NotFoundException(`Categoria ${dto.categoryId} não encontrada`);
    }

    const data = TransactionMapper.toEntity(dto);
    const saved = await this.repository.createTransaction(data);
    return TransactionMapper.toResponseDto(saved);
  }

  async createTransactionsMany(
    dtos: CreateTransactionRequestDto[],
  ): Promise<MessageResponseDto> {
    const entities = dtos.map(TransactionMapper.toEntity);
    await this.repository.createTransactionsMany(entities);
    return { message: 'Transações criadas com sucesso' };
  }

  async updateTransaction(
    transactionId: number,
    dto: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const exists = await this.repository.findTransactionById(transactionId);
    if (!exists) throw new NotFoundException();

    const updated = await this.repository.updateTransaction(transactionId, dto);
    return TransactionMapper.toResponseDto(updated);
  }

  async deleteTransaction(transactionId: number): Promise<void> {
    const found = await this.repository.findTransactionById(transactionId);
    if (!found) {
      throw new NotFoundException(`Transação ${transactionId} não encontrada.`);
    }

    await this.repository.deleteTransaction(transactionId);
  }
}
