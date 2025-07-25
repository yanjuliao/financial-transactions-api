import { Module, forwardRef } from '@nestjs/common';
import { TransactionService } from './service/transaction.service';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionController } from './controller/transaction.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { UserBalanceSnapshotModule } from 'src/user-balance/user-balance.module';

@Module({
  imports: [PrismaModule, forwardRef(() => UserBalanceSnapshotModule)],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}