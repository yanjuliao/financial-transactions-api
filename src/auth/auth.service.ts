import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.senha)) {
      return user;
    }
    throw new UnauthorizedException('Usuário ou senha inválidos');
  }

  async login(user: User) {
    const payload = { sub: user.userId, email: user.email };
    const token = this.jwtService.sign(payload);
    await this.redisService.set(`jwt:${user.userId}`, token, 3600);
    return { access_token: token };
  }
}