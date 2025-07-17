import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { UsersRepository } from './repository/users.repository';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionService } from 'src/transaction/service/transaction.service';
import { TransactionRepository } from 'src/transaction/repository/transaction.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService, TransactionService, TransactionRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
