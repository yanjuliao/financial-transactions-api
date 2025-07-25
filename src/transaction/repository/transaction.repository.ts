import { Injectable } from '@nestjs/common';
import { Transaction, Category } from '@prisma/client';
import { UpdateTransactionRequestDto } from '../dto/requests/update-transaction.request.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTransactions(userId: number): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
    });
  }

  async findTransactionById(
    transactionId: number,
    userId: number,
  ): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({
      where: {
        transactionId,
        userId,
      },
    });
  }

  async findTransactionsByPeriod(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });
  }

  async findTransactionsUntilDate(
    userId: number,
    untilDate: Date,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          lte: untilDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
  
  async createTransaction(data: {
    date: Date;
    price: number;
    type: 'ENTRADA' | 'SAIDA';
    userId: number;
    category: Category;
  }): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  async createTransactionsMany(
    data: {
      date: Date;
      price: number;
      type: 'ENTRADA' | 'SAIDA';
      userId: number;
      category: Category;
    }[],
  ): Promise<void> {
    await this.prisma.transaction.createMany({ data });
  }

  async updateTransaction(
    transactionId: number,
    userId: number,
    data: UpdateTransactionRequestDto,
  ): Promise<Transaction> {
    return this.prisma.transaction
      .updateMany({
        where: { transactionId, userId },
        data,
      })
      .then((res) => {
        if (res.count === 0) throw new Error('Unauthorized or not found');
        return this.findTransactionById(
          transactionId,
          userId,
        ) as Promise<Transaction>;
      });
  }

  async deleteTransaction(
    transactionId: number,
    userId: number,
  ): Promise<void> {
    await this.prisma.transaction.deleteMany({
      where: { transactionId, userId },
    });
  }

  async findAnyByUserId(userId: number): Promise<boolean> {
    const count = await this.prisma.transaction.count({
      where: { userId },
    });
  
    return count > 0;
  }
}
