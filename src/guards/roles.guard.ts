import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRole = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRole) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const { role } = req.user;

      return role === requiredRole;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'User has no access to this operation',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
