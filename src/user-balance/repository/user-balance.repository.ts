import { Injectable } from '@nestjs/common';
import { UserBalanceSnapshot } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserBalanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveUserBalance(
    userId: number,
    snapshotDate: Date,
    balance: number | Decimal,
  ): Promise<UserBalanceSnapshot> {
    return this.prisma.userBalanceSnapshot.upsert({
      where: {
        userId_snapshotDate: {
          userId,
          snapshotDate,
        },
      },
      update: {
        balance: new Decimal(balance),
      },
      create: {
        userId,
        snapshotDate,
        balance: new Decimal(balance),
      },
    });
  }

  async findPreviousBalanceBeforeDate(
    userId: number,
    date: Date,
  ): Promise<UserBalanceSnapshot | null> {
    return this.prisma.userBalanceSnapshot.findFirst({
      where: {
        userId,
        snapshotDate: {
          lt: date,
        },
      },
      orderBy: {
        snapshotDate: 'desc',
      },
    });
  }

  async findUserBalanceFromDate(
    userId: number,
    fromDate: Date,
  ): Promise<UserBalanceSnapshot[]> {
    return this.prisma.userBalanceSnapshot.findMany({
      where: {
        userId,
        snapshotDate: {
          gte: fromDate,
        },
      },
      orderBy: {
        snapshotDate: 'asc',
      },
    });
  }

  async findBalancesByUserId(userId: number): Promise<UserBalanceSnapshot[]> {
    return this.prisma.userBalanceSnapshot.findMany({
      where: { userId },
      orderBy: { snapshotDate: 'desc' },
    });
  }
}
