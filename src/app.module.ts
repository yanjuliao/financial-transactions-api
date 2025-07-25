import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtRedisAuthGuard } from './common/guards/jwt-redis-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TransactionModule } from './transaction/transaction.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { OwnerOrAdminGuard } from './common/guards/owner-or-admin.guard';
import { UserBalanceSnapshotModule } from './user-balance/user-balance.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TransactionModule,
    UsersModule,
    AuthModule,
    RedisModule,
    UserBalanceSnapshotModule,
    CommonModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtRedisAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OwnerOrAdminGuard,
    },
  ],
})
export class AppModule {}
