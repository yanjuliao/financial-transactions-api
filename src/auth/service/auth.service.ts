import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/service/users.service';
import { RedisService } from '../../redis/redis.service';
import { User } from '@prisma/client';
import { LoginRequestDto } from '../dto/login.request.dto';

@Injectable()
export class AuthService {
  private INVALID_CREDENTIALS_MESSAGE = 'invalid_username_or_password';
  private INVALID_TOKEN_MESSAGE = 'expired_or_invalid_token';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(loginRequest: LoginRequestDto) {
    this.validateLoginRequest(loginRequest);
    const storedUser = await this.findUserByEmail(loginRequest.email);
    await this.validateCredentials(storedUser, loginRequest);
    return this.generateToken(storedUser);
  }

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

  private validateLoginRequest(loginRequest: LoginRequestDto) {
    if (!loginRequest.email || !loginRequest.password) {
      throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
    }
  }

  private async findUserByEmail(email: string) {
    if (!email) {
      throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
    }

    return this.usersService.findByEmail(email);
  }

  private async validateCredentials(
    storedUser: User,
    loginRequest: LoginRequestDto,
  ) {
    const isPasswordValid = await bcrypt.compare(  
      loginRequest.password,
      storedUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
    }
  }

  private async generateToken(user: User) {
    const payload = { sub: user.userId, email: user.email };
    const token = this.jwtService.sign(payload);
    await this.redisService.set(`jwt:${user.userId}`, token, 3600);
    return { access_token: token };
  }
}
