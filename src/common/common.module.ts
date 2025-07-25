import { Module } from '@nestjs/common';
import { RetryExecutor } from './utils/retry-executor';
import { JwtRedisAuthGuard } from './guards/jwt-redis-auth.guard';
import { OwnerOrAdminGuard } from './guards/owner-or-admin.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule
  ],
  providers: [
    JwtRedisAuthGuard,
    RolesGuard,
    OwnerOrAdminGuard,
    RetryExecutor
  ],
  exports: [JwtRedisAuthGuard, RolesGuard, OwnerOrAdminGuard, RetryExecutor],
})
export class CommonModule {}
