import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUserByContext = (ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
};

const CurrentUser = createParamDecorator((_data: any, ctx: ExecutionContext) =>
  getCurrentUserByContext(ctx),
);

export { CurrentUser };
