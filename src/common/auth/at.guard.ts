import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      ctx.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(ctx);
  }
}
