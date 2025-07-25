// src/user-balance/service/user-balance.service.ts
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserBalanceRepository } from '../repository/user-balance.repository';
import { UserBalanceResponseDto } from '../dto/response/user-balance.response.dto';
import { RetryExecutor } from 'src/common/utils/retry-executor';
import { Transaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { BalanceResponseDto } from 'src/user-balance/dto/response/balance.response.dto';
import { TransactionService } from 'src/transaction/service/transaction.service';

@Injectable()
export class UserBalanceService {
  constructor(
    private readonly repository: UserBalanceRepository,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly retryExecutor: RetryExecutor,
  ) {}

  async findBalancesByUserId(
    userId: number,
  ): Promise<UserBalanceResponseDto[]> {
    const snapshots = await this.repository.findBalancesByUserId(userId);

    return snapshots.map((s) => ({
      userId: s.userId,
      snapshotDate: s.snapshotDate,
      balance: Number(s.balance),
    }));
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

    return { balance: entradas.minus(saidas).toNumber() };
  }

  private async calculateAndSaveBalance(
    userId: number,
    untilDate: Date,
  ): Promise<void> {
    const transactions =
      await this.transactionService.findTransactionsUntilDate(
        userId,
        untilDate,
      );
    const balance = this.calculateBalance(transactions).balance;

    await this.repository.saveUserBalance(userId, untilDate, balance);
  }

  private calculateAndSaveBalanceWithRetry(
    userId: number,
    untilDate: Date,
  ): void {
    this.retryExecutor.execute(() =>
      this.calculateAndSaveBalance(userId, untilDate),
    );
  }

  private async recalculateFutureSnapshots(
    userId: number,
    fromDate: Date,
  ): Promise<void> {
    const futureSnapshots = await this.repository.findUserBalanceFromDate(
      userId,
      fromDate,
    );

    for (const snapshot of futureSnapshots) {
      const transactions =
        await this.transactionService.findTransactionsUntilDate(
          userId,
          snapshot.snapshotDate,
        );
      const balance = this.calculateBalance(transactions).balance;

      await this.repository.saveUserBalance(
        userId,
        snapshot.snapshotDate,
        balance,
      );
    }
  }

  private recalculateFutureSnapshotsWithRetry(
    userId: number,
    fromDate: Date,
  ): void {
    this.retryExecutor.execute(() =>
      this.recalculateFutureSnapshots(userId, fromDate),
    );
  }

  updateSnapshotsWithRetry(userId: number, date: Date): void {
    this.calculateAndSaveBalanceWithRetry(userId, date);
    this.recalculateFutureSnapshotsWithRetry(userId, date);
  }
}
