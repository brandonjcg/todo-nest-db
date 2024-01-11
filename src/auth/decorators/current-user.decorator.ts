import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enums';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    if (!user) throw new InternalServerErrorException('Request without user');
    if (!roles.length) return user;

    const hasRole: boolean = user.roles.some((role: ValidRoles) =>
      roles.includes(role),
    );
    if (hasRole) return user;

    throw new ForbiddenException('User without role allowed');
  },
);
