import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [TransactionModule, CategoryModule],
})
export class AppModule {}