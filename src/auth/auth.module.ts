import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RedisService } from '../redis/redis.service';
import { UsersModule } from 'src/users/users.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtRedisAuthGuard } from './jwt-redis-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1h' },
    }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RedisService, JwtRedisAuthGuard],
  exports: [JwtRedisAuthGuard],
})
export class AuthModule {}
