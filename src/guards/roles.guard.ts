import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;
    const grantAccess = roles[0]
      .toLocaleLowerCase()
      .includes(user.role.toLocaleLowerCase());

    if (!grantAccess) {
      throw new ForbiddenException('Доступ запрещен');
    }
    return user && user.role && grantAccess;
  }
}
