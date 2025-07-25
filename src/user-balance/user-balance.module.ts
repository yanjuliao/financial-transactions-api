import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserBalanceRepository } from './repository/user-balance.repository';
import { UserBalanceController } from './controller/user-balance.controller';
import { UserBalanceService } from './service/user-balance.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [PrismaModule, forwardRef(() => TransactionModule), CommonModule],
  controllers: [UserBalanceController],
  providers: [UserBalanceRepository, UserBalanceService],
  exports: [UserBalanceRepository, UserBalanceService],
})
export class UserBalanceSnapshotModule {}
