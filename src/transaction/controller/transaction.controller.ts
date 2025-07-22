import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  Req,
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
import { RoleType } from 'src/users/enum';

@ApiTags('Transactions')
@ApiBearerAuth('jwt-auth')
@Roles(RoleType.USER, RoleType.ADMIN)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'List all transactions for the authenticated user' })
  async getAllTransactions(@Req() req): Promise<TransactionResponseDto[]> {
    const userId = req.user.userId;
    return this.service.getAllTransactions(userId);
  }

  @Get('period')
  @ApiOperation({ summary: 'Get transactions by period' })
  async getTransactionsByPeriod(
    @Query() dto: FilterByPeriodRequestDto,
    @Req() req,
  ): Promise<TransactionResponseDto[]> {
    const userId = req.user.userId;
    return this.service.getTransactionsByPeriod(dto, userId);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get balance of incomes and expenses by period' })
  async getBalance(
    @Query() dto: FilterByPeriodRequestDto,
    @Req() req,
  ): Promise<BalanceResponseDto> {
    const userId = req.user.userId;
    return this.service.getBalanceByPeriod(dto, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  async getTransactionById(
    @Param('id') transactionId: string,
    @Req() req,
  ): Promise<TransactionResponseDto> {
    const userId = req.user.userId;
    return this.service.getTransactionById(Number(transactionId), userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  async createTransaction(
    @Body() dto: CreateTransactionRequestDto,
    @Req() req,
  ): Promise<TransactionResponseDto> {
    const userId = req.user.userId;
    return this.service.createTransaction(dto, userId);
  }

  @Post('many')
  @ApiOperation({ summary: 'Create multiple transactions' })
  async createTransactionsMany(
    @Body() dto: CreateManyTransactionRequestDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.service.createTransactionsMany(dto.transactions, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update transaction data' })
  async updateTransaction(
    @Param('id') transactionId: string,
    @Body() dto: UpdateTransactionRequestDto,
    @Req() req,
  ): Promise<TransactionResponseDto> {
    const userId = req.user.userId;
    return this.service.updateTransaction(Number(transactionId), dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  async deleteTransaction(@Param('id') transactionId: string, @Req() req) {
    const userId = req.user.userId;
    return this.service.deleteTransaction(Number(transactionId), userId);
  }
}
