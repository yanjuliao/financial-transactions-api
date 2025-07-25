import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/service/users.service';
import { RedisService } from '../../redis/redis.service';
import { User } from '@prisma/client';
import { LoginRequestDto } from '../dto/login.request.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private INVALID_CREDENTIALS_MESSAGE = 'invalid_username_or_password';

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService
  ) {}

  async login(loginRequest: LoginRequestDto) {
    this.validateLoginRequest(loginRequest);
    const storedUser = await this.usersService.findUserByEmailValidation(loginRequest.email);
    await this.validateCredentials(storedUser, loginRequest);
    return this.tokenService.generateToken(storedUser);
  }

  private validateLoginRequest(loginRequest: LoginRequestDto) {
    if (!loginRequest.email || !loginRequest.password) {
      throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
    }
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
}
