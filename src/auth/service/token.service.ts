import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../redis/redis.service';
import { User } from '@prisma/client';

@Injectable()
export class TokenService {
  private INVALID_TOKEN_MESSAGE = 'expired_or_invalid_token';

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateToken(token: string) {
    if (!token) {
      throw new UnauthorizedException(this.INVALID_TOKEN_MESSAGE);
    }

    const payload = this.jwtService.decode(token) as { sub: number };
    const userId = payload?.sub;
    if (!userId) {
      throw new UnauthorizedException(this.INVALID_TOKEN_MESSAGE);
    }

    const storedToken = await this.redisService.get(`jwt:${userId}`);

    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException(this.INVALID_TOKEN_MESSAGE);
    }
  }

  async generateToken(user: User) {
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    await this.redisService.set(`jwt:${user.userId}`, token, 3600);
    return { access_token: token };
  }
}
