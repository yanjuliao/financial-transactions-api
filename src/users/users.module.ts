import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { UsersRepository } from './repository/users.repository';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [forwardRef(() => TransactionModule)], 
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
