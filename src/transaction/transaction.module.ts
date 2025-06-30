import { Module } from '@nestjs/common';
import { TransactionService } from './service/transaction.service';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionController } from './controller/transaction.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [PrismaModule, CategoryModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}