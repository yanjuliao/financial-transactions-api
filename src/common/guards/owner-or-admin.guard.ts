import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ALLOW_OWNER_OR_ADMIN_KEY } from '../decorators/allow-owner-or-admin.decorator';
import { RoleType } from 'src/users/enum';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  private FORBIDDEN_MESSAGE = 'you_can_only_view_your_own_data.';

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allow = this.reflector.get<boolean>(
      ALLOW_OWNER_OR_ADMIN_KEY,
      context.getHandler(),
    );
    if (!allow) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = parseInt(request.params.id, 10);

    if (user.role === RoleType.ADMIN) return true;
    if (user.userId === paramId) return true;

    throw new ForbiddenException(this.FORBIDDEN_MESSAGE);
  }
}
