import { Module } from '@nestjs/common';
import { TransactionService } from './service/transaction.service';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionController } from './controller/transaction.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}