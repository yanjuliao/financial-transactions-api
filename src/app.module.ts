import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtRedisAuthGuard } from './auth/jwt-redis-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    TransactionModule,
    CategoryModule,
    UsersModule,
    AuthModule,
    RedisModule,
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
  ],
})
export class AppModule {}
