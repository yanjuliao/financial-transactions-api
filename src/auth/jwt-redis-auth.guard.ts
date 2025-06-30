import { Reflector } from '@nestjs/core';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../redis/redis.service';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class JwtRedisAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly redisService: RedisService,
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
    const userId = request.user?.sub;

    const storedToken = await this.redisService.get(`jwt:${userId}`);
    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException('Token expirado ou inválido no Redis');
    }

    return activated;
  }
}
