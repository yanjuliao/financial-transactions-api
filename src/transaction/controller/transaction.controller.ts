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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FilterByPeriodRequestDto } from '../dto/requests/filter-by-period.request.dto';
import { CreateManyTransactionRequestDto } from '../dto/requests/create-many-transactions.request.dto';
import { CreateTransactionRequestDto } from '../dto/requests/create-transaction.request.dto';
import { UpdateTransactionRequestDto } from '../dto/requests/update-transaction.request.dto';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';
import { BalanceResponseDto } from '../dto/response/balance.response.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Transactions')
@ApiBearerAuth('jwt-auth')
@Roles('ADMIN', 'USER')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'List all transactions' })
  async getAllTransactions(): Promise<TransactionResponseDto[]> {
    return this.service.getAllTransactions();
  }

  @Get('period')
  @ApiOperation({ summary: 'Get transactions by period' })
  async getTransactionsByPeriod(
    @Query() dto: FilterByPeriodRequestDto,
  ): Promise<TransactionResponseDto[]> {
    return this.service.getTransactionsByPeriod(dto);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get balance of incomes and expenses by period' })
  async getBalance(
    @Query() dto: FilterByPeriodRequestDto,
  ): Promise<BalanceResponseDto> {
    return this.service.getBalanceByPeriod(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  async getTransactionById(
    @Param('id') transactionId: string,
  ): Promise<TransactionResponseDto> {
    return this.service.getTransactionById(Number(transactionId));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  async createTransaction(
    @Body() dto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.service.createTransaction(dto);
  }

  @Post('many')
  @ApiOperation({ summary: 'Create multiple transactions' })
  createTransactionsMany(@Body() dto: CreateManyTransactionRequestDto) {
    return this.service.createTransactionsMany(dto.transactions);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update transaction data' })
  async updateTransaction(
    @Param('id') transactionId: string,
    @Body() dto: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.service.updateTransaction(Number(transactionId), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  async deleteTransaction(@Param('id') transactionId: string) {
    return this.service.deleteTransaction(Number(transactionId));
  }
}
