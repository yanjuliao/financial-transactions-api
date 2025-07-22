import { Reflector } from '@nestjs/core';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { AuthService } from './service/auth.service';
import { TokenService } from './service/token.service';

@Injectable()
export class JwtRedisAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const activated = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    this.tokenService.validateToken(token);

    return activated;
  }
}
