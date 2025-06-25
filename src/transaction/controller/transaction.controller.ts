import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FilterByPeriodRequestDto } from '../dto/requests/filter-by-period.request.dto';
import { CreateManyTransactionRequestDto } from '../dto/requests/create-many-transactions.request.dto';
import { CreateTransactionRequestDto } from '../dto/requests/create-transaction.request.dto';
import { UpdateTransactionRequestDto } from '../dto/requests/update-transaction.request.dto';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';
import { BalanceResponseDto } from '../dto/response/balance.response.dto';
import { MessageResponseDto } from '../dto/response/message.response.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as transações' })
  async getAllTransactions(): Promise<TransactionResponseDto[]> {
    return this.service.getAllTransactions();
  }

  @Get('period')
  @ApiOperation({ summary: 'Buscar transações por período' })
  async getTransactionsByPeriod(
    @Query() dto: FilterByPeriodRequestDto,
  ): Promise<TransactionResponseDto[]> {
    return this.service.getTransactionsByPeriod(dto);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Obter saldo de entradas e saídas por período' })
  async getBalance(
    @Query() dto: FilterByPeriodRequestDto,
  ): Promise<BalanceResponseDto> {
    return this.service.getBalanceByPeriod(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar transação por ID' })
  async getTransactionById(
    @Param('id') transactionId: string,
  ): Promise<TransactionResponseDto> {
    return this.service.getTransactionById(Number(transactionId));
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova transação' })
  async createTransaction(
    @Body() dto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.service.createTransaction(dto);
  }

  @Post('many')
  @ApiOperation({ summary: 'Criar várias transações' })
  createTransactionsMany(@Body() dto: CreateManyTransactionRequestDto) {
    return this.service.createTransactionsMany(dto.transactions);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma transação' })
  async updateTransaction(
    @Param('id') transactionId: string,
    @Body() dto: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.service.updateTransaction(Number(transactionId), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma transação' })
  async deleteTransaction(@Param('id') transactionId: string) {
    return this.service.deleteTransaction(Number(transactionId));
  }
}
