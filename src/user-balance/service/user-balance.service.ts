import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserBalanceRepository } from '../repository/user-balance.repository';
import { UserBalanceResponseDto } from '../dto/response/user-balance.response.dto';
import { RetryExecutor } from 'src/common/utils/retry-executor';
import { Transaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { BalanceResponseDto } from 'src/user-balance/dto/response/balance.response.dto';
import { TransactionService } from 'src/transaction/service/transaction.service';
import { TransactionType } from 'src/transaction/enum';

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

  private calculateBalanceFromPrevious(
    previousBalance: number | Decimal | undefined,
    transaction: Transaction,
  ): BalanceResponseDto {
    const prev = new Decimal(previousBalance ?? 0);
    const value = new Decimal(transaction.price);

    const currentBalance =
      transaction.type === TransactionType.ENTRADA
        ? prev.plus(value)
        : prev.minus(value);

    return { balance: currentBalance.toNumber() };
  }

  private async calculateAndSaveBalance(
    transaction: Transaction,
  ): Promise<void> {
    const previousSnapshot =
      await this.repository.findPreviousBalanceBeforeDate(
        transaction.userId,
        transaction.date,
      );

    const balance = this.calculateBalanceFromPrevious(
      previousSnapshot?.balance,
      transaction,
    );

    await this.repository.saveUserBalance(
      transaction.userId,
      transaction.date,
      balance.balance,
    );
  }

  private calculateAndSaveBalanceWithRetry(transaction: Transaction): void {
    this.retryExecutor.execute(() => this.calculateAndSaveBalance(transaction));
  }

  private async recalculateFutureBalances(
    userId: number,
    fromDate: Date,
  ): Promise<void> {
    const futureSnapshots = await this.repository.findUserBalanceFromDate(
      userId,
      fromDate,
    );
    if (futureSnapshots.length === 0) return;
    futureSnapshots.sort(
      (a, b) => a.snapshotDate.getTime() - b.snapshotDate.getTime(),
    );

    const previousSnapshot =
      await this.repository.findPreviousBalanceBeforeDate(userId, fromDate);
    let runningBalance = new Decimal(previousSnapshot?.balance ?? 0);
    const baseDate = previousSnapshot?.snapshotDate ?? new Date(0);

    const lastSnapshotDate =
      futureSnapshots[futureSnapshots.length - 1].snapshotDate;
    const transactions =
      await this.transactionService.findTransactionsBetweenDates(
        userId,
        baseDate,
        lastSnapshotDate,
      );

    let txIndex = 0;

    for (const snapshot of futureSnapshots) {
      while (
        txIndex < transactions.length &&
        transactions[txIndex].date.getTime() <= snapshot.snapshotDate.getTime()
      ) {
        const tx = transactions[txIndex];
        const { balance } = this.calculateBalanceFromPrevious(
          runningBalance,
          tx,
        );
        runningBalance = new Decimal(balance);
        txIndex++;
      }

      await this.repository.saveUserBalance(
        userId,
        snapshot.snapshotDate,
        runningBalance.toNumber(),
      );
    }
  }

  private recalculateFutureBalancesWithRetry(
    userId: number,
    fromDate: Date,
  ): void {
    this.retryExecutor.execute(() =>
      this.recalculateFutureBalances(userId, fromDate),
    );
  }

  async updateBalancesWithRetry(transaction: Transaction): Promise<void> {
    this.calculateAndSaveBalanceWithRetry(transaction);
    this.recalculateFutureBalancesWithRetry(
      transaction.userId,
      transaction.date,
    );
  }

  async updateBalancesAfterTransactionRemoval(transaction: Transaction): Promise<void> {
    await this.retryExecutor.execute(async () => {
      await this.recalculateFutureBalances(transaction.userId, transaction.date);
    });
  }

  async updateBalancesFromListWithRetry(
    transactions: Transaction[],
  ): Promise<void> {
    if (transactions.length === 0) return;

    await this.retryExecutor.execute(async () => {
      const sorted = transactions.sort(
        (a, b) => a.date.getTime() - b.date.getTime(),
      );

      for (const tx of sorted) {
        await this.calculateAndSaveBalance(tx);
      }

      const last = sorted[sorted.length - 1];
      await this.recalculateFutureBalances(last.userId, last.date);
    });
  }
}
