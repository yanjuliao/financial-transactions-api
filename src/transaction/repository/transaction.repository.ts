import { Injectable } from '@nestjs/common';
import { Transaction, Category } from '@prisma/client';
import { UpdateTransactionRequestDto } from '../dto/requests/update-transaction.request.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAllTransactions(): Promise<
    (Transaction & { category: { categoryId: number; name: string } })[]
  > {
    return this.prisma.transaction.findMany({ include: { category: true } });
  }

  async findTransactionById(
    transactionId: number,
  ): Promise<
    (Transaction & { category: { categoryId: number; name: string } }) | null
  > {
    return this.prisma.transaction.findUnique({
      where: { transactionId },
      include: { category: true },
    });
  }

  async findTransactionsByPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<
    (Transaction & { category: { categoryId: number; name: string } })[]
  > {
    return this.prisma.transaction.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: { category: true },
    });
  }

  async createTransaction(data: {
    date: Date;
    price: number;
    type: 'ENTRADA' | 'SAIDA';
    categoryId: number;
  }): Promise<Transaction & { category: Category }> {
    return this.prisma.transaction.create({
      data,
      include: { category: true },
    });
  }

  async createTransactionsMany(
    data: {
      date: Date;
      price: number;
      type: 'ENTRADA' | 'SAIDA';
      categoryId: number;
    }[],
  ): Promise<void> {
    await this.prisma.transaction.createMany({ data });
  }

  async updateTransaction(
    transactionId: number,
    data: UpdateTransactionRequestDto,
  ): Promise<Transaction & { category: Category }> {
    const safeData = data;
  
    return this.prisma.transaction.update({
      where: { transactionId },
      data: safeData,
      include: { category: true },
    });
  }

  async deleteTransaction(transactionId: number): Promise<void> {
    await this.prisma.transaction.delete({
      where: { transactionId: transactionId },
    });
  }
}
