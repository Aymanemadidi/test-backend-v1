import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './enums/role.enum';
import { ROLES_KEY } from './roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    // console.log(req.headers.authorization);
    const user = this.jwtService.decode(req?.cookies?.access_token);
    if (!user) {
      throw new ForbiddenException();
    }
    console.log(user['email']);
    const requestUserRole = user['role'];
    // console.log(requiredRoles);
    // console.log(requestUserRole);

    // const smth = context.switchToHttp().getRequest();
    // console.log(smth);

    return requiredRoles.includes(requestUserRole);
    // return true;
  }
}

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     console.log('Can Activate');
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles) {
//       return true;
//     }
//     console.log(`I enter ${__filename}`);
//     const { user } = context.switchToHttp().getRequest();
//     return requiredRoles.some((role: Role) => user.role === role);
//   }
// }
