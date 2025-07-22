import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RedisService } from '../redis/redis.service';
import { UsersModule } from 'src/users/users.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtRedisAuthGuard } from './jwt-redis-auth.guard';
import { RolesGuard } from './roles.guard';
import { TokenService } from './service/token.service';

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
  providers: [
    AuthService,
    JwtStrategy,
    RedisService,
    JwtRedisAuthGuard,
    RolesGuard,
    TokenService,
  ],
  exports: [JwtRedisAuthGuard, AuthService, RolesGuard, TokenService],
})
export class AuthModule {}
